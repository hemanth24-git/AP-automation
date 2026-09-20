from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.approvals.models import WorkflowStatus
from apps.approvals.services import create_workflow
from apps.authentication.models import Role
from apps.common.test_utils import make_user, make_vendor, setup_approval_matrix
from apps.invoices.models import Invoice, InvoiceStatus


class ApprovalWorkflowTests(APITestCase):
    def setUp(self):
        setup_approval_matrix()
        self.vendor = make_vendor()
        self.processor = make_user(Role.AP_PROCESSOR, username="proc_ap1")
        self.ap_manager = make_user(Role.AP_MANAGER, username="mgr_ap1")
        self.finance_manager = make_user(Role.FINANCE_MANAGER, username="fin_ap1")
        self.other_manager = make_user(Role.AP_MANAGER, username="mgr_ap2")

    def _invoice(self, amount):
        return Invoice.objects.create(
            invoice_number=f"INV-{amount}",
            vendor=self.vendor,
            total_amount=Decimal(amount),
            currency="INR",
            status=InvoiceStatus.VALIDATED,
            uploaded_by=self.processor,
        )

    def test_small_invoice_needs_only_ap_manager(self):
        invoice = self._invoice("20000.00")
        workflow = create_workflow(invoice, notify=False)
        self.assertEqual(workflow.steps.count(), 1)
        self.assertEqual(workflow.steps.first().role_required, Role.AP_MANAGER)

    def test_large_invoice_needs_three_approvers_in_order(self):
        invoice = self._invoice("600000.00")
        workflow = create_workflow(invoice, notify=False)
        roles = list(workflow.steps.order_by("step_number").values_list("role_required", flat=True))
        self.assertEqual(roles, [Role.AP_MANAGER, Role.FINANCE_MANAGER, Role.ADMIN])

    def test_full_approval_sequence_moves_invoice_to_approved(self):
        invoice = self._invoice("200000.00")  # AP_MANAGER + FINANCE_MANAGER
        create_workflow(invoice, notify=False)

        self.client.force_authenticate(self.ap_manager)
        first_step = invoice.approval_workflow.steps.get(step_number=1)
        response = self.client.post(reverse("approval-approve", args=[first_step.id]), {"comment": "ok"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        invoice.refresh_from_db()
        self.assertEqual(invoice.status, InvoiceStatus.PENDING_APPROVAL)  # still waiting on step 2

        self.client.force_authenticate(self.finance_manager)
        second_step = invoice.approval_workflow.steps.get(step_number=2)
        response = self.client.post(reverse("approval-approve", args=[second_step.id]), {"comment": "ok"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        invoice.refresh_from_db()
        self.assertEqual(invoice.status, InvoiceStatus.APPROVED)
        self.assertEqual(invoice.approval_workflow.status, WorkflowStatus.APPROVED)

    def test_reject_requires_a_comment(self):
        invoice = self._invoice("20000.00")
        create_workflow(invoice, notify=False)
        step = invoice.approval_workflow.steps.get(step_number=1)

        self.client.force_authenticate(self.ap_manager)
        response = self.client.post(reverse("approval-reject", args=[step.id]), {"comment": ""})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(reverse("approval-reject", args=[step.id]), {"comment": "Wrong rate"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        invoice.refresh_from_db()
        self.assertEqual(invoice.status, InvoiceStatus.REJECTED)

    def test_only_assigned_approver_can_act(self):
        invoice = self._invoice("20000.00")
        create_workflow(invoice, notify=False)
        step = invoice.approval_workflow.steps.get(step_number=1)

        self.client.force_authenticate(self.other_manager)  # not the assigned approver
        response = self.client.post(reverse("approval-approve", args=[step.id]), {"comment": "ok"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cannot_act_on_a_step_that_is_not_yet_current(self):
        invoice = self._invoice("200000.00")
        create_workflow(invoice, notify=False)
        second_step = invoice.approval_workflow.steps.get(step_number=2)

        self.client.force_authenticate(self.finance_manager)
        response = self.client.post(reverse("approval-approve", args=[second_step.id]), {"comment": "ok"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
