"""Field parsing layer.

Deliberately separate from `providers.py` (raw OCR) and `apps/invoices`
validation: this module's only job is turning raw OCR text into a dict of
{field_name: (value, confidence)} candidates using pattern matching. It
knows nothing about business rules (mandatory fields, GST format
correctness, duplicate detection, etc.) -- that lives in the validation
engine (apps/invoices/validation.py).
"""

import re
from datetime import datetime

GSTIN_PATTERN = re.compile(r"\b\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]\b")
# Keyword patterns are matched per-line (see parse_fields) so a label like
# "Tax Invoice" on one line can't bleed into a value on the next line.
INVOICE_NUMBER_PATTERN = re.compile(
    r"invoice[\s#:.-]*(?:no|number|num)[\s#:.-]*([A-Za-z0-9/\-]{3,25})", re.IGNORECASE
)
PO_NUMBER_PATTERN = re.compile(
    r"(?:p\.?o\.?|purchase order)[\s#:.-]*(?:no|number)?[\s#:.-]*([A-Za-z0-9/\-]{3,25})", re.IGNORECASE
)
AMOUNT_PATTERN = re.compile(
    r"\b(?<!sub)(?<!sub )(?:grand total|amount due|amount payable|total)\b[\s:₹Rs.]*([\d,]+\.?\d*)",
    re.IGNORECASE,
)
SUBTOTAL_PATTERN = re.compile(r"(?:sub\s*-?\s*total)[\s:₹Rs.]*([\d,]+\.?\d*)", re.IGNORECASE)
TAX_PATTERN = re.compile(r"(?:tax|gst)(?:\s*amount)?[\s:₹Rs.]*([\d,]+\.?\d*)", re.IGNORECASE)
DATE_PATTERN = re.compile(r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2})\b")

DATE_FORMATS = ["%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d", "%d/%m/%y", "%d-%m-%y", "%m/%d/%Y"]


def _clean_amount(raw):
    try:
        return float(raw.replace(",", ""))
    except (ValueError, AttributeError):
        return None


def _parse_date(raw):
    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(raw, fmt).date().isoformat()
        except ValueError:
            continue
    return None


def parse_fields(raw_text: str, base_confidence: float = 70.0):
    """Extract candidate field values from raw OCR text.

    `base_confidence` is the OCR engine's own average word confidence; each
    parsed field's confidence is derived from it (full weight when a clean
    regex match is found, reduced when we have to guess).
    """
    results = {}
    lines = [ln.strip() for ln in raw_text.splitlines() if ln.strip()]

    gstin_match = GSTIN_PATTERN.search(raw_text)
    if gstin_match:
        results["gstin"] = (gstin_match.group(0), base_confidence)

    inv_match = INVOICE_NUMBER_PATTERN.search(raw_text)
    if inv_match:
        results["invoice_number"] = (inv_match.group(1).strip(), base_confidence)

    po_match = PO_NUMBER_PATTERN.search(raw_text)
    if po_match:
        results["po_number"] = (po_match.group(1).strip(), base_confidence * 0.9)

    total_match = AMOUNT_PATTERN.search(raw_text)
    if total_match:
        amount = _clean_amount(total_match.group(1))
        if amount is not None:
            results["total_amount"] = (str(amount), base_confidence)

    subtotal_match = SUBTOTAL_PATTERN.search(raw_text)
    if subtotal_match:
        amount = _clean_amount(subtotal_match.group(1))
        if amount is not None:
            results["subtotal"] = (str(amount), base_confidence * 0.9)

    tax_match = TAX_PATTERN.search(raw_text)
    if tax_match:
        amount = _clean_amount(tax_match.group(1))
        if amount is not None:
            results["tax_amount"] = (str(amount), base_confidence * 0.9)

    date_matches = DATE_PATTERN.findall(raw_text)
    if date_matches:
        parsed = _parse_date(date_matches[0])
        if parsed:
            results["invoice_date"] = (parsed, base_confidence * 0.85)
        if len(date_matches) > 1:
            due_parsed = _parse_date(date_matches[1])
            if due_parsed:
                results["due_date"] = (due_parsed, base_confidence * 0.7)

    # Heuristic: vendor name is usually one of the first non-empty lines
    # that isn't itself a label like "Invoice" or "Tax Invoice".
    for line in lines[:5]:
        lowered = line.lower()
        if len(line) > 3 and not any(kw in lowered for kw in ["invoice", "tax invoice", "bill to", "gstin"]):
            results["vendor_name"] = (line, base_confidence * 0.6)
            break

    return results
