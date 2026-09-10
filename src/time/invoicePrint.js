export function currencyFormatter(currency) {
  const locales = {
    USD: 'en-US',
    GBP: 'en-GB',
    EUR: 'en-IE',
    CAD: 'en-CA',
    AUD: 'en-AU',
  }
  return new Intl.NumberFormat(locales[currency] || 'en-GB', {
    style: 'currency',
    currency,
  })
}

export function formatMoney(minor, currency) {
  return currencyFormatter(currency).format(Number(minor || 0) / 100)
}

export function formatDuration(seconds) {
  const totalMinutes = Math.max(0, Math.round(Number(seconds || 0) / 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (!hours) return `${minutes}m`
  if (!minutes) return `${hours}h`
  return `${hours}h ${String(minutes).padStart(2, '0')}m`
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function lines(value = '') {
  return escapeHtml(value).replaceAll('\n', '<br>')
}

export function printInvoice(invoice, existingWindow = null) {
  const sender = invoice.sender_snapshot || {}
  const client = invoice.client_snapshot || {}
  const items = invoice.line_items || []
  const currency = invoice.currency || client.currency || 'USD'
  const amount = (minor) => formatMoney(minor, currency)
  const issueDate = new Date(`${invoice.issue_date}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
  const periodStart = new Date(`${invoice.period_start}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
  const periodEnd = new Date(`${invoice.period_end}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
  const totalSeconds = items.reduce((sum, item) => sum + Number(item.duration_seconds || 0), 0)

  const rows = items.map((item) => {
    const date = new Date(item.started_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    return `<tr>
      <td>${escapeHtml(date)}</td>
      <td class="description">${escapeHtml(item.description || 'Professional services')}</td>
      <td class="right nowrap">${escapeHtml(formatDuration(item.duration_seconds))}</td>
      <td class="right nowrap">${escapeHtml(amount(item.rate_minor))}/hr</td>
      <td class="right nowrap"><strong>${escapeHtml(amount(item.amount_minor))}</strong></td>
    </tr>`
  }).join('')

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(invoice.invoice_number)}</title>
<style>
  @page { size: A4; margin: 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; color: #172033; margin: 0; font-size: 12px; }
  .top { display: flex; justify-content: space-between; gap: 40px; align-items: flex-start; padding-bottom: 24px; border-bottom: 3px solid #0f2b4c; }
  h1 { margin: 0; font-size: 38px; letter-spacing: 0.03em; color: #0f2b4c; }
  .sender-name { font-size: 19px; font-weight: 800; color: #0f2b4c; margin-bottom: 6px; }
  .muted { color: #667085; }
  .invoice-meta { text-align: right; line-height: 1.7; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin: 28px 0 30px; }
  .eyebrow { text-transform: uppercase; font-size: 10px; letter-spacing: .12em; color: #667085; font-weight: 800; margin-bottom: 8px; }
  .client-name { font-size: 16px; font-weight: 800; margin-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; background: #0f2b4c; color: white; padding: 10px 9px; font-size: 10px; text-transform: uppercase; letter-spacing: .06em; }
  td { padding: 11px 9px; border-bottom: 1px solid #e4e7ec; vertical-align: top; }
  tr:nth-child(even) td { background: #f8fafc; }
  .right { text-align: right; }
  .nowrap { white-space: nowrap; }
  .description { min-width: 220px; }
  .totals { margin-left: auto; width: 310px; margin-top: 22px; }
  .totals-row { display: flex; justify-content: space-between; padding: 7px 0; }
  .amount-due { margin-top: 7px; padding: 14px 16px; background: #f2deac; color: #0f2b4c; border-radius: 8px; font-size: 18px; font-weight: 900; }
  .notes { margin-top: 36px; padding-top: 18px; border-top: 1px solid #e4e7ec; line-height: 1.55; }
  .footer { margin-top: 38px; color: #98a2b3; font-size: 10px; text-align: center; }
  @media print { .no-print { display: none !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
  <div class="top">
    <div>
      <div class="sender-name">${escapeHtml(sender.business_name || 'Shane Velez')}</div>
      <div class="muted">${lines(sender.address || '')}</div>
      ${sender.email ? `<div class="muted" style="margin-top:5px">${escapeHtml(sender.email)}</div>` : ''}
    </div>
    <div class="invoice-meta">
      <h1>INVOICE</h1>
      <div><strong>${escapeHtml(invoice.invoice_number)}</strong></div>
      <div class="muted">Issued ${escapeHtml(issueDate)}</div>
    </div>
  </div>

  <div class="grid">
    <div>
      <div class="eyebrow">Bill to</div>
      <div class="client-name">${escapeHtml(client.name || '')}</div>
      <div class="muted">${lines(client.billing_address || '')}</div>
      ${client.email ? `<div class="muted" style="margin-top:5px">${escapeHtml(client.email)}</div>` : ''}
    </div>
    <div>
      <div class="eyebrow">Billing period</div>
      <div><strong>${escapeHtml(periodStart)} – ${escapeHtml(periodEnd)}</strong></div>
      <div class="muted" style="margin-top:5px">${items.length} ${items.length === 1 ? 'entry' : 'entries'} · ${escapeHtml(formatDuration(totalSeconds))}</div>
    </div>
  </div>

  <table>
    <thead><tr><th>Date</th><th>Description</th><th class="right">Time</th><th class="right">Rate</th><th class="right">Amount</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="totals">
    <div class="totals-row"><span class="muted">Subtotal</span><strong>${escapeHtml(amount(invoice.total_minor))}</strong></div>
    <div class="totals-row amount-due"><span>Amount due</span><span>${escapeHtml(amount(invoice.total_minor))}</span></div>
  </div>

  ${sender.payment_instructions ? `<div class="notes"><div class="eyebrow">Payment details</div>${lines(sender.payment_instructions)}</div>` : ''}
  <div class="footer">Thank you for your business.</div>
  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 250));</script>
</body>
</html>`

  const popup = existingWindow || window.open('', '_blank')
  if (!popup) throw new Error('Your browser blocked the invoice window. Allow pop-ups for this site and try again.')
  try { popup.opener = null } catch {}
  popup.document.open()
  popup.document.write(html)
  popup.document.close()
}
