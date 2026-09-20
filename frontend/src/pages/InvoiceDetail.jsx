import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  Save,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ConfidenceBadge from '../components/invoices/ConfidenceBadge'
import InvoicePreview from '../components/invoices/InvoicePreview'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ErrorState from '../components/ui/ErrorState'
import LoadingState from '../components/ui/LoadingState'
import StatusBadge from '../components/ui/StatusBadge'
import { useToast } from '../context/ToastContext'
import { extractErrorMessage } from '../services/api'
import { invoicesApi } from '../services/invoices'

const FIELD_LABELS = {
  vendor_name: 'Vendor Name',
  invoice_number: 'Invoice Number',
  invoice_date: 'Invoice Date',
  due_date: 'Due Date',
  gstin: 'GSTIN',
  po_number: 'PO Number',
  subtotal: 'Subtotal',
  tax_amount: 'Tax Amount',
  total_amount: 'Total Amount',
}

function formatCurrency(amount, currency = 'INR') {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount)
}

export default function InvoiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fieldValues, setFieldValues] = useState({})
  const [dirty, setDirty] = useState(new Set())
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await invoicesApi.get(id)
      setInvoice(data)
      const values = {}
      data.extracted_fields.forEach((f) => {
        values[f.field_name] = f.value
      })
      setFieldValues(values)
      setDirty(new Set())
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleFieldChange = (name, value) => {
    setFieldValues((prev) => ({ ...prev, [name]: value }))
    setDirty((prev) => new Set(prev).add(name))
  }

  const handleSave = async () => {
    if (dirty.size === 0) return
    setSaving(true)
    try {
      const fields = Array.from(dirty).map((field_name) => ({ field_name, value: fieldValues[field_name] || '' }))
      const { data } = await invoicesApi.updateExtractedFields(id, fields)
      setInvoice(data)
      setDirty(new Set())
      toast.success('Extracted fields updated.')
    } catch (err) {
      toast.error(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Loading invoice..." />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!invoice) return null

  const primaryDoc = invoice.documents?.[0]
  const openExceptions = invoice.exceptions?.filter((e) => e.status === 'OPEN') || []

  return (
    <div>
      <button
        onClick={() => navigate('/invoices')}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-3"
      >
        <ArrowLeft size={15} /> Back to invoices
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-800">{invoice.invoice_number || 'Untitled Invoice'}</h1>
            <StatusBadge status={invoice.status} />
            <ConfidenceBadge level={invoice.ocr_confidence_level} score={invoice.ocr_confidence} />
          </div>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <Building2 size={14} /> {invoice.vendor_name || invoice.vendor_name_raw || 'Vendor not resolved'}
            <span className="mx-1">&middot;</span>
            <Calendar size={14} /> {invoice.invoice_date || 'No date extracted'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Total Amount</p>
          <p className="text-2xl font-semibold text-slate-800">{formatCurrency(invoice.total_amount, invoice.currency)}</p>
        </div>
      </div>

      {openExceptions.length > 0 && (
        <div className="mb-5 rounded-md border border-orange-200 bg-orange-50 px-4 py-3">
          <p className="text-sm font-medium text-orange-800 flex items-center gap-1.5">
            <AlertTriangle size={15} /> {openExceptions.length} open exception{openExceptions.length > 1 ? 's' : ''}
          </p>
          <ul className="mt-1.5 space-y-1">
            {openExceptions.map((exc) => (
              <li key={exc.id} className="text-xs text-orange-700 flex items-center gap-2">
                <Badge color="orange">{exc.severity}</Badge>
                {exc.exception_type_display}: {exc.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        <Card title="Document Preview">
          <InvoicePreview document={primaryDoc} />
        </Card>

        <Card
          title="Extracted Fields"
          actions={
            dirty.size > 0 && (
              <Button size="sm" icon={Save} onClick={handleSave} loading={saving}>
                Save changes
              </Button>
            )
          }
        >
          <div className="space-y-3">
            {invoice.extracted_fields.map((f) => (
              <div key={f.id} className="grid grid-cols-[1fr,auto] gap-2 items-start">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    {FIELD_LABELS[f.field_name] || f.field_name}
                    {f.is_mandatory && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  <input
                    value={fieldValues[f.field_name] ?? ''}
                    onChange={(e) => handleFieldChange(f.field_name, e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  />
                </div>
                <div className="pt-5 flex flex-col items-end gap-1">
                  <ConfidenceBadge level={f.confidence >= 85 ? 'HIGH' : f.confidence >= 60 ? 'MEDIUM' : 'LOW'} score={f.confidence} />
                  {f.is_edited && <span className="text-[10px] text-blue-500 font-medium">edited</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Line Items" className="mt-5">
        {invoice.line_items.length === 0 ? (
          <p className="text-sm text-slate-400">No line items extracted.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                <th className="py-2">#</th>
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Tax</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.line_items.map((li) => (
                <tr key={li.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-2 text-slate-500">{li.line_no}</td>
                  <td className="py-2 text-slate-700">{li.description}</td>
                  <td className="py-2 text-right text-slate-700">{li.quantity}</td>
                  <td className="py-2 text-right text-slate-700">{formatCurrency(li.unit_price, invoice.currency)}</td>
                  <td className="py-2 text-right text-slate-700">{formatCurrency(li.tax_amount, invoice.currency)}</td>
                  <td className="py-2 text-right font-medium text-slate-800">{formatCurrency(li.amount, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <div className="grid sm:grid-cols-2 gap-5 mt-5">
        <Card title="Amount Breakdown">
          <dl className="space-y-2 text-sm">
            {[
              ['Subtotal', invoice.subtotal],
              ['CGST', invoice.cgst],
              ['SGST', invoice.sgst],
              ['IGST', invoice.igst],
              ['Discount', invoice.discount],
              ['Tax Amount', invoice.tax_amount],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-slate-700 font-medium">{formatCurrency(value, invoice.currency)}</dd>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-slate-100">
              <dt className="text-slate-800 font-semibold">Total</dt>
              <dd className="text-slate-800 font-semibold">{formatCurrency(invoice.total_amount, invoice.currency)}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Invoice Details">
          <dl className="space-y-2 text-sm">
            {[
              ['GSTIN', invoice.gstin || '—'],
              ['PO Number', invoice.po_number || invoice.po_number_raw || 'Not linked'],
              ['Department', invoice.department || '—'],
              ['Payment Terms', invoice.payment_terms || '—'],
              ['Due Date', invoice.due_date || '—'],
              ['Uploaded By', invoice.uploaded_by_name || '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-slate-700 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  )
}
