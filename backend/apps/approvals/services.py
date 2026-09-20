from decimal import Decimal

from django.db import transaction
from django.db.models import Q
from django.utils import timezone

from apps.approvals.models import (
    ApprovalAction,
    ApprovalMatrixRule,
    ApprovalStep,
    ApprovalWorkflow,
    StepStatus,
    WorkflowStatus,
)
from apps.audit_logs.services import log_action
from apps.authentication.models import User


def resolve_required_roles(amount: Decimal):
    """Look up the configurable approval matrix for the roles required to
    approve an invoice of this amount, in sequential order."""
    rule = (
        ApprovalMatrixRule.objects.filter(is_active=True, min_amount__lte=amount)
        .filter(Q(max_amount__isnull=True) | Q(max_amount__gte=amount))
        .order_by("-min_amount")
        .first()
    )
    if rule:
        return rule.required_roles
    return ["AP_MANAGER"]


def _pick_assignee(role):
    return User.objects.filter(role=role, is_active=True).order_by("username").first()


@transaction.atomic
def create_workflow(invoice, notify=True):
    """Create (or recreate) a sequential approval workflow for an invoice
    based on the configured amount-based approval matrix."""
    ApprovalWorkflow.objects.filter(invoice=invoice).delete()

    roles = resolve_required_roles(invoice.total_amount or Decimal("0"))
    workflow = ApprovalWorkflow.objects.create(invoice=invoice, status=WorkflowStatus.IN_PROGRESS)

    for idx, role in enumerate(roles, start=1):
        ApprovalStep.objects.create(
            workflow=workflow,
            step_number=idx,
            role_required=role,
            assigned_user=_pick_assignee(role),
            status=StepStatus.PENDING,
            due_at=timezone.now() + timezone.timedelta(days=3),
        )

    invoice.status = "PENDING_APPROVAL"
    invoice.save(update_fields=["status"])

    if notify:
        first_step = workflow.steps.order_by("step_number").first()
        if first_step and first_step.assigned_user:
            from apps.notifications.services import notify_user

            notify_user(
                first_step.assigned_user,
                "APPROVAL_REQUIRED",
                f"Invoice {invoice.invoice_number or invoice.id} requires your approval.",
                link=f"/approvals/{workflow.id}",
            )

    log_action(
        action="CREATE",
        entity_type="ApprovalWorkflow",
        entity_id=workflow.id,
        description=f"Approval workflow started for invoice {invoice.invoice_number}",
    )
    return workflow


@transaction.atomic
def apply_action(step: ApprovalStep, actor, action: str, comment: str = ""):
    """Record an approve/reject/request-changes decision on a step and
    progress (or terminate) the parent workflow accordingly."""
    workflow = step.workflow
    invoice = workflow.invoice

    ApprovalAction.objects.create(step=step, actor=actor, action=action, comment=comment)

    if action == "APPROVE":
        step.status = StepStatus.APPROVED
        step.save(update_fields=["status"])
        next_step = workflow.steps.filter(step_number__gt=step.step_number).order_by("step_number").first()
        if next_step:
            workflow.current_step_number = next_step.step_number
            workflow.save(update_fields=["current_step_number"])
            if next_step.assigned_user:
                from apps.notifications.services import notify_user

                notify_user(
                    next_step.assigned_user,
                    "APPROVAL_REQUIRED",
                    f"Invoice {invoice.invoice_number or invoice.id} requires your approval.",
                    link=f"/approvals/{workflow.id}",
                )
        else:
            workflow.status = WorkflowStatus.APPROVED
            workflow.completed_at = timezone.now()
            workflow.save(update_fields=["status", "completed_at"])
            invoice.status = "APPROVED"
            invoice.save(update_fields=["status"])

    elif action == "REJECT":
        step.status = StepStatus.REJECTED
        step.save(update_fields=["status"])
        workflow.status = WorkflowStatus.REJECTED
        workflow.completed_at = timezone.now()
        workflow.save(update_fields=["status", "completed_at"])
        invoice.status = "REJECTED"
        invoice.save(update_fields=["status"])

    elif action == "REQUEST_CHANGES":
        step.status = StepStatus.CHANGES_REQUESTED
        step.save(update_fields=["status"])
        workflow.status = WorkflowStatus.CHANGES_REQUESTED
        workflow.save(update_fields=["status"])
        invoice.status = "VALIDATED"
        invoice.save(update_fields=["status"])

    audit_action = {"APPROVE": "APPROVAL", "REJECT": "REJECTION", "REQUEST_CHANGES": "REQUEST_CHANGES"}[action]
    log_action(
        action=audit_action,
        entity_type="ApprovalStep",
        entity_id=step.id,
        description=f"{actor} {action} step {step.step_number} for invoice {invoice.invoice_number}",
        user=actor,
    )
    return step
