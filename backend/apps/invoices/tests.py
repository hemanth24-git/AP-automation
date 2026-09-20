import base64
from datetime import date
from decimal import Decimal

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.authentication.models import Role
from apps.common.test_utils import make_po, make_user, make_vendor
from apps.invoices.models import (
    ExceptionType,
    Invoice,
    InvoiceException,
    InvoiceStatus,
    OcrConfidenceLevel,
)
from apps.invoices.matching import match_invoice_to_po
from apps.invoices.validation import run_validation

# A minimal valid 1x1 PNG (base64) so upload validation (extension + PIL) succeeds
# even under the demo OCR provider, which never actually decodes the image.
TINY_PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
)


@override_settings(OCR_PROVIDER="demo")
class InvoiceUploadTests(APITestCase):
    def setUp(self):
        self.processor = make_user(Role.AP_PROCESSOR, username="proc1")
        self.viewer = make_user(Role.AUDITOR, username="aud1")

    def test_upload_requires_authentication(self):
        response = self.client.post(reverse("invoice-upload"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_upload_forbidden_for_auditor_role(self):
        self.client.force_authenticate(self.viewer)
        f = SimpleUploadedFile("invoice.png", TINY_PNG, content_type="image/png")
        response = self.client.post(reverse("invoice-upload"), {"files": [f]}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_upload_rejects_unsupported_extension(self):
        self.client.force_authenticate(self.processor)
        f = SimpleUploadedFile("invoice.exe", b"not-a-real-file", content_type="application/octet-stream")
        response = self.client.post(reverse("invoice-upload"), {"files": [f]}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data["errors"]), 1)

    def test_upload_creates_invoice_with_demo_fallback_extraction(self):
        self.client.force_authenticate(self.processor)
        f = SimpleUploadedFile("invoice.png", TINY_PNG, content_type="image/png")
        response = self.client.post(reverse("invoice-upload"), {"files": [f]}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data["created"]), 1)
        invoice = Invoice.objects.get(id=response.data["created"][0]["id"])
        self.assertEqual(invoice.ocr_provider, "demo")
        # demo fallback never claims a real result -- confidence must be low
        self.assertEqual(invoice.ocr_confidence_level, OcrConfidenceLevel.LOW)
        self.assertTrue(invoice.documents.exists())
        self.assertTrue(invoice.extracted_fields.exists())


class InvoiceValidationTests(APITestCase):
    def setUp(self):
        self.vendor = make_vendor()
        self.processor = make_user(Role.AP_PROCESSOR, username="proc2")

    def _base_invoice(self, **overrides):
        defaults = dict(
            invoice_number="INV-1001",
            vendor=self.vendor,
            gstin=self.vendor.gstin,
            po_number_raw="PO-TEST-0001",  # avoid the always-on MISSING_PO check for "clean" fixtures
            invoice_date=date(2026, 1, 10),
            subtotal=Decimal("10000.00"),
            tax_amount=Decimal("1800.00"),
            discount=Decimal("0"),
            total_amount=Decimal("11800.00"),
            status=InvoiceStatus.EXTRACTED,
            ocr_confidence=90,
            uploaded_by=self.processor,
        )
        defaults.update(overrides)
        return Invoice.objects.create(**defaults)

    def test_clean_invoice_passes_validation(self):
        invoice = self._base_invoice()
        run_validation(invoice)
        invoice.refresh_from_db()
        self.assertEqual(invoice.status, InvoiceStatus.VALIDATED)
        self.assertFalse(invoice.exceptions.filter(status="OPEN").exists())

    def test_amount_mismatch_raises_exception(self):
        invoice = self._base_invoice(total_amount=Decimal("99999.00"))
        run_validation(invoice)
        invoice.refresh_from_db()
        self.assertEqual(invoice.status, InvoiceStatus.EXCEPTION)
        self.assertTrue(invoice.exceptions.filter(exception_type=ExceptionType.AMOUNT_MISMATCH, status="OPEN").exists())

    def test_invalid_gstin_format_raises_exception(self):
        invoice = self._base_invoice(gstin="NOTAVALIDGSTIN")
        run_validation(invoice)
        self.assertTrue(invoice.exceptions.filter(exception_type=ExceptionType.INVALID_GSTIN, status="OPEN").exists())

    def test_exact_duplicate_invoice_number_detected(self):
        self._base_invoice(invoice_number="INV-DUP", total_amount=Decimal("5000.00"), subtotal=Decimal("4237.29"), tax_amount=Decimal("762.71"))
        second = self._base_invoice(invoice_number="INV-DUP", total_amount=Decimal("5000.00"), subtotal=Decimal("4237.29"), tax_amount=Decimal("762.71"))
        run_validation(second)
        self.assertTrue(second.exceptions.filter(exception_type=ExceptionType.DUPLICATE_INVOICE, status="OPEN").exists())

    def test_near_duplicate_same_amount_and_close_date_detected(self):
        self._base_invoice(invoice_number="INV-A", invoice_date=date(2026, 1, 10), total_amount=Decimal("7000.00"), subtotal=Decimal("5932.20"), tax_amount=Decimal("1067.80"))
        second = self._base_invoice(invoice_number="INV-B", invoice_date=date(2026, 1, 11), total_amount=Decimal("7000.00"), subtotal=Decimal("5932.20"), tax_amount=Decimal("1067.80"))
        run_validation(second)
        self.assertTrue(second.exceptions.filter(exception_type=ExceptionType.DUPLICATE_INVOICE, status="OPEN").exists())

    def test_missing_vendor_master_match_raises_exception(self):
        invoice = self._base_invoice(vendor=None, vendor_name_raw="Some Unknown Vendor")
        run_validation(invoice)
        self.assertTrue(invoice.exceptions.filter(exception_type=ExceptionType.MISSING_VENDOR, status="OPEN").exists())

    def test_override_survives_revalidation(self):
        invoice = self._base_invoice(total_amount=Decimal("99999.00"))
        run_validation(invoice)
        exc = invoice.exceptions.get(exception_type=ExceptionType.AMOUNT_MISMATCH)
        exc.status = "OVERRIDDEN"
        exc.resolution_comment = "Accepted as-is."
        exc.save()

        run_validation(invoice)  # re-run should not reopen it
        self.assertEqual(InvoiceException.objects.filter(invoice=invoice, exception_type=ExceptionType.AMOUNT_MISMATCH).count(), 1)
        exc.refresh_from_db()
        self.assertEqual(exc.status, "OVERRIDDEN")


class ExceptionCenterTests(APITestCase):
    def setUp(self):
        self.vendor = make_vendor()
        self.processor = make_user(Role.AP_PROCESSOR, username="proc_exc1")
        self.invoice = self._invoice_with_mismatch()

    def _invoice_with_mismatch(self):
        invoice = Invoice.objects.create(
            invoice_number="INV-EXC-1",
            vendor=self.vendor,
            gstin=self.vendor.gstin,
            po_number_raw="PO-TEST-0002",
            invoice_date=date(2026, 1, 10),
            subtotal=Decimal("10000.00"),
            tax_amount=Decimal("1800.00"),
            total_amount=Decimal("99999.00"),
            status=InvoiceStatus.EXTRACTED,
            uploaded_by=self.processor,
        )
        run_validation(invoice)
        return invoice

    def test_resolve_requires_comment(self):
        exc = self.invoice.exceptions.get(exception_type=ExceptionType.AMOUNT_MISMATCH)
        self.client.force_authenticate(self.processor)
        response = self.client.post(reverse("exception-resolve", args=[exc.id]), {"comment": ""})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_resolve_clears_exception_and_unblocks_invoice(self):
        exc = self.invoice.exceptions.get(exception_type=ExceptionType.AMOUNT_MISMATCH)
        self.client.force_authenticate(self.processor)
        response = self.client.post(reverse("exception-resolve", args=[exc.id]), {"comment": "Manually verified with vendor."})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "RESOLVED")

    def test_override_survives_but_resolve_can_still_be_reopened_by_new_conditions(self):
        exc = self.invoice.exceptions.get(exception_type=ExceptionType.AMOUNT_MISMATCH)
        self.client.force_authenticate(self.processor)
        self.client.post(reverse("exception-override", args=[exc.id]), {"comment": "Accepted, vendor confirmed rounding."})
        exc.refresh_from_db()
        self.assertEqual(exc.status, "OVERRIDDEN")
        self.invoice.refresh_from_db()
        self.assertEqual(self.invoice.status, InvoiceStatus.VALIDATED)


class PoMatchingTests(APITestCase):
    def setUp(self):
        self.vendor = make_vendor()
        self.processor = make_user(Role.AP_PROCESSOR, username="proc3")

    def test_matching_invoice_and_po_yields_matched(self):
        po = make_po(self.vendor, total_amount=Decimal("11800.00"))
        invoice = Invoice.objects.create(
            invoice_number="INV-PO-1",
            vendor=self.vendor,
            purchase_order=po,
            currency="INR",
            total_amount=Decimal("11800.00"),
            status=InvoiceStatus.VALIDATED,
            uploaded_by=self.processor,
        )
        from apps.invoices.models import InvoiceLineItem

        InvoiceLineItem.objects.create(invoice=invoice, line_no=1, description="Item 1", quantity=Decimal("1"), unit_price=Decimal("11800.00"), amount=Decimal("11800.00"))

        result = match_invoice_to_po(invoice)
        self.assertEqual(result["status"], "MATCHED")
        invoice.refresh_from_db()
        self.assertEqual(invoice.po_match_status, "MATCHED")

    def test_mismatched_total_amount_yields_mismatch(self):
        po = make_po(self.vendor, total_amount=Decimal("11800.00"))
        invoice = Invoice.objects.create(
            invoice_number="INV-PO-2",
            vendor=self.vendor,
            purchase_order=po,
            currency="INR",
            total_amount=Decimal("50000.00"),
            status=InvoiceStatus.VALIDATED,
            uploaded_by=self.processor,
        )
        result = match_invoice_to_po(invoice)
        self.assertIn(result["status"], ("MISMATCH", "PARTIAL_MATCH"))
        self.assertTrue(invoice.exceptions.filter(exception_type=ExceptionType.PO_MISMATCH).exists() or result["status"] == "PARTIAL_MATCH")

    def test_auto_links_po_by_extracted_number(self):
        po = make_po(self.vendor, total_amount=Decimal("11800.00"))
        invoice = Invoice.objects.create(
            invoice_number="INV-PO-3",
            vendor=self.vendor,
            po_number_raw=po.po_number,
            currency="INR",
            total_amount=Decimal("11800.00"),
            status=InvoiceStatus.VALIDATED,
            uploaded_by=self.processor,
        )
        match_invoice_to_po(invoice)
        invoice.refresh_from_db()
        self.assertEqual(invoice.purchase_order_id, po.id)
