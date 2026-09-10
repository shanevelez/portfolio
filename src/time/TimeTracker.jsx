import { useEffect, useMemo, useState } from 'react'
import {
  consumeSessionFromUrl,
  deleteRows,
  getCurrentUser,
  insertRow,
  isSupabaseConfigured,
  selectRows,
  sendMagicLink,
  signOut,
  updateRows,
  upsertRow,
} from './supabase'
import { formatDuration, formatMoney, printInvoice } from './invoicePrint'

const CURRENCIES = ['USD', 'GBP', 'EUR', 'CAD', 'AUD']
const TABS = ['Timer', 'Clients', 'Entries', 'Invoices', 'Settings']

const blankClient = {
  id: null,
  name: '',
  email: '',
  billing_address: '',
  hourly_rate: '',
  currency: 'USD',
  active: true,
}

const blankEntry = {
  id: null,
  client_id: '',
  description: '',
  started_at: '',
  ended_at: '',
  hourly_rate: '',
  currency: 'USD',
}

const defaultProfile = {
  business_name: 'Shane Velez',
  address: '',
  email: '',
  payment_instructions: '',
  invoice_prefix: 'SV',
}

function minorFromInput(value) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.round(number * 100) : 0
}

function inputFromMinor(value) {
  return (Number(value || 0) / 100).toFixed(2)
}

function toDateTimeLocal(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16)
}

function fromDateTimeLocal(value) {
  return new Date(value).toISOString()
}

function monthKey(dateValue) {
  const date = new Date(dateValue)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function currentMonth() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function monthBounds(month) {
  const [year, mon] = month.split('-').map(Number)
  const start = new Date(year, mon - 1, 1)
  const next = new Date(year, mon, 1)
  const end = new Date(year, mon, 0)
  const dateOnly = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  return { start, next, periodStart: dateOnly(start), periodEnd: dateOnly(end) }
}

function entrySeconds(entry, now = Date.now()) {
  const start = new Date(entry.started_at).getTime()
  const end = entry.ended_at ? new Date(entry.ended_at).getTime() : now
  return Math.max(0, Math.round((end - start) / 1000))
}

function amountForEntry(entry) {
  return Math.round((entrySeconds(entry) / 3600) * Number(entry.rate_minor || 0))
}

function moneyGroups(entries) {
  const totals = new Map()
  entries.forEach((entry) => {
    const currency = entry.currency || 'USD'
    totals.set(currency, (totals.get(currency) || 0) + amountForEntry(entry))
  })
  return [...totals.entries()]
}

function Alert({ type = 'info', children }) {
  const classes = {
    info: 'border-sky-400/30 bg-sky-400/10 text-sky-100',
    error: 'border-red-400/30 bg-red-400/10 text-red-100',
    success: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
  }
  return <div className={`rounded-xl border px-4 py-3 text-sm ${classes[type]}`}>{children}</div>
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</span>
      {children}
    </label>
  )
}

function TextInput(props) {
  return <input {...props} className={`w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400 ${props.className || ''}`} />
}

function SelectInput(props) {
  return <select {...props} className={`w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-sky-400 ${props.className || ''}`} />
}

function PrimaryButton({ className = '', ...props }) {
  return <button {...props} className={`rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-40 ${className}`} />
}

function SecondaryButton({ className = '', ...props }) {
  return <button {...props} className={`rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 ${className}`} />
}

function Login() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setStatus('')
    setBusy(true)
    try {
      await sendMagicLink(email.trim())
      setStatus('Sign-in link sent. Open it from your email to enter the tracker.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto mt-[8vh] max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-2xl shadow-black/30">
        <div className="mb-7">
          <a href="/" className="text-sm text-sky-400 hover:text-sky-300">← shanevelez.com</a>
          <h1 className="mt-5 text-3xl font-black tracking-tight">Time Tracker</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">Private billing workspace. Sign in using your email link.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email">
            <TextInput type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <PrimaryButton className="w-full" disabled={busy}>{busy ? 'Sending…' : 'Email me a sign-in link'}</PrimaryButton>
          {status && <Alert type="success">{status}</Alert>}
          {error && <Alert type="error">{error}</Alert>}
        </form>
      </div>
    </main>
  )
}

function SetupRequired() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-amber-500/30 bg-slate-900 p-7">
        <h1 className="text-3xl font-black">Time Tracker setup required</h1>
        <p className="mt-3 leading-7 text-slate-300">The tracker has been added, but this copy of the project does not yet contain Supabase credentials.</p>
        <div className="mt-6 rounded-2xl bg-slate-950 p-5 font-mono text-sm text-slate-300">
          <div>VITE_SUPABASE_URL=…</div>
          <div>VITE_SUPABASE_ANON_KEY=…</div>
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-400">The SQL schema is included at <code className="text-sky-300">supabase/time-tracker.sql</code>. No billing data is stored in browser localStorage.</p>
      </div>
    </main>
  )
}

function TimeTrackerApp({ user }) {
  const [tab, setTab] = useState('Timer')
  const [clients, setClients] = useState([])
  const [entries, setEntries] = useState([])
  const [invoices, setInvoices] = useState([])
  const [profile, setProfile] = useState(defaultProfile)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)
  const [now, setNow] = useState(Date.now())

  const [timerClient, setTimerClient] = useState('')
  const [timerDescription, setTimerDescription] = useState('')
  const [clientForm, setClientForm] = useState(blankClient)
  const [entryForm, setEntryForm] = useState(blankEntry)
  const [invoiceClient, setInvoiceClient] = useState('')
  const [invoiceMonth, setInvoiceMonth] = useState(currentMonth())

  const runningEntry = useMemo(() => entries.find((entry) => !entry.ended_at) || null, [entries])
  const activeClients = useMemo(() => clients.filter((client) => client.active), [clients])
  const clientMap = useMemo(() => new Map(clients.map((client) => [client.id, client])), [clients])

  useEffect(() => {
    if (!runningEntry) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [runningEntry])

  useEffect(() => {
    loadAll()
  }, [])

  useEffect(() => {
    if (!timerClient && activeClients.length) setTimerClient(activeClients[0].id)
    if (!invoiceClient && activeClients.length) setInvoiceClient(activeClients[0].id)
  }, [activeClients, timerClient, invoiceClient])

  async function loadAll() {
    setLoading(true)
    try {
      const [clientRows, entryRows, invoiceRows, profileRows] = await Promise.all([
        selectRows('clients', 'select=*&order=active.desc,name.asc'),
        selectRows('time_entries', 'select=*&order=started_at.desc&limit=1000'),
        selectRows('invoices', 'select=*&order=issue_date.desc,created_at.desc&limit=250'),
        selectRows('billing_profiles', 'select=*&limit=1'),
      ])
      setClients(clientRows || [])
      setEntries(entryRows || [])
      setInvoices(invoiceRows || [])
      if (profileRows?.[0]) setProfile(profileRows[0])
    } catch (err) {
      setNotice({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  async function runAction(action, successText) {
    setBusy(true)
    setNotice(null)
    try {
      await action()
      if (successText) setNotice({ type: 'success', text: successText })
      return true
    } catch (err) {
      setNotice({ type: 'error', text: err.message })
      return false
    } finally {
      setBusy(false)
    }
  }

  async function startTimer() {
    const client = clientMap.get(timerClient)
    if (!client) return setNotice({ type: 'error', text: 'Choose a client first.' })
    await runAction(async () => {
      const row = await insertRow('time_entries', {
        owner_id: user.id,
        client_id: client.id,
        description: timerDescription.trim() || null,
        started_at: new Date().toISOString(),
        ended_at: null,
        rate_minor: client.hourly_rate_minor,
        currency: client.currency,
      })
      setEntries((current) => [row, ...current])
      setTimerDescription('')
      setNow(Date.now())
    }, `Timer started for ${client.name}.`)
  }

  async function stopTimer() {
    if (!runningEntry) return
    await runAction(async () => {
      const rows = await updateRows('time_entries', `id=eq.${runningEntry.id}&owner_id=eq.${user.id}`, {
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      const updated = rows?.[0]
      if (updated) setEntries((current) => current.map((entry) => entry.id === updated.id ? updated : entry))
    }, 'Timer stopped and saved.')
  }

  function editClient(client) {
    setClientForm({
      ...client,
      hourly_rate: inputFromMinor(client.hourly_rate_minor),
    })
    setTab('Clients')
  }

  async function saveClient(event) {
    event.preventDefault()
    if (!clientForm.name.trim()) return
    const payload = {
      owner_id: user.id,
      name: clientForm.name.trim(),
      email: clientForm.email.trim() || null,
      billing_address: clientForm.billing_address.trim() || null,
      hourly_rate_minor: minorFromInput(clientForm.hourly_rate),
      currency: clientForm.currency,
      active: Boolean(clientForm.active),
      updated_at: new Date().toISOString(),
    }
    await runAction(async () => {
      if (clientForm.id) {
        const rows = await updateRows('clients', `id=eq.${clientForm.id}&owner_id=eq.${user.id}`, payload)
        const updated = rows?.[0]
        setClients((current) => current.map((client) => client.id === updated.id ? updated : client))
      } else {
        const created = await insertRow('clients', payload)
        setClients((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)))
      }
      setClientForm(blankClient)
    }, clientForm.id ? 'Client updated.' : 'Client added.')
  }

  function newManualEntry() {
    const client = activeClients[0]
    const nowDate = new Date()
    const oneHourAgo = new Date(nowDate.getTime() - 60 * 60 * 1000)
    setEntryForm({
      ...blankEntry,
      client_id: client?.id || '',
      started_at: toDateTimeLocal(oneHourAgo.toISOString()),
      ended_at: toDateTimeLocal(nowDate.toISOString()),
      hourly_rate: client ? inputFromMinor(client.hourly_rate_minor) : '',
      currency: client?.currency || 'USD',
    })
    setTab('Entries')
  }

  function editEntry(entry) {
    setEntryForm({
      id: entry.id,
      client_id: entry.client_id,
      description: entry.description || '',
      started_at: toDateTimeLocal(entry.started_at),
      ended_at: toDateTimeLocal(entry.ended_at),
      hourly_rate: inputFromMinor(entry.rate_minor),
      currency: entry.currency,
    })
    setTab('Entries')
  }

  function entryClientChanged(clientId) {
    const client = clientMap.get(clientId)
    setEntryForm((form) => ({
      ...form,
      client_id: clientId,
      hourly_rate: client ? inputFromMinor(client.hourly_rate_minor) : form.hourly_rate,
      currency: client?.currency || form.currency,
    }))
  }

  async function saveEntry(event) {
    event.preventDefault()
    if (!entryForm.client_id || !entryForm.started_at || !entryForm.ended_at) return
    const start = new Date(entryForm.started_at)
    const end = new Date(entryForm.ended_at)
    if (!(end > start)) return setNotice({ type: 'error', text: 'End time must be after start time.' })
    const payload = {
      owner_id: user.id,
      client_id: entryForm.client_id,
      description: entryForm.description.trim() || null,
      started_at: fromDateTimeLocal(entryForm.started_at),
      ended_at: fromDateTimeLocal(entryForm.ended_at),
      rate_minor: minorFromInput(entryForm.hourly_rate),
      currency: entryForm.currency,
      updated_at: new Date().toISOString(),
    }
    await runAction(async () => {
      if (entryForm.id) {
        const rows = await updateRows('time_entries', `id=eq.${entryForm.id}&owner_id=eq.${user.id}`, payload)
        const updated = rows?.[0]
        setEntries((current) => current.map((entry) => entry.id === updated.id ? updated : entry))
      } else {
        const created = await insertRow('time_entries', payload)
        setEntries((current) => [created, ...current])
      }
      setEntryForm(blankEntry)
    }, entryForm.id ? 'Time entry updated.' : 'Time entry added.')
  }

  async function removeEntry(entry) {
    const client = clientMap.get(entry.client_id)
    if (!window.confirm(`Delete this ${client?.name || ''} time entry? This cannot be undone.`)) return
    await runAction(async () => {
      await deleteRows('time_entries', `id=eq.${entry.id}&owner_id=eq.${user.id}`)
      setEntries((current) => current.filter((item) => item.id !== entry.id))
    }, 'Time entry deleted.')
  }

  async function saveProfile(event) {
    event.preventDefault()
    await runAction(async () => {
      const saved = await upsertRow('billing_profiles', {
        owner_id: user.id,
        business_name: profile.business_name.trim() || 'Shane Velez',
        address: profile.address.trim() || null,
        email: profile.email.trim() || null,
        payment_instructions: profile.payment_instructions.trim() || null,
        invoice_prefix: (profile.invoice_prefix.trim() || 'SV').toUpperCase(),
        updated_at: new Date().toISOString(),
      }, 'owner_id')
      setProfile(saved || profile)
    }, 'Invoice settings saved.')
  }

  const invoiceEntries = useMemo(() => {
    if (!invoiceClient || !invoiceMonth) return []
    return entries.filter((entry) => entry.client_id === invoiceClient && entry.ended_at && monthKey(entry.started_at) === invoiceMonth)
      .sort((a, b) => new Date(a.started_at) - new Date(b.started_at))
  }, [entries, invoiceClient, invoiceMonth])

  const invoiceCurrency = invoiceEntries[0]?.currency || clientMap.get(invoiceClient)?.currency || 'USD'
  const invoiceTotal = invoiceEntries.reduce((sum, entry) => sum + amountForEntry(entry), 0)

  function invoiceNumberFor(month, existing) {
    if (existing?.invoice_number) return existing.invoice_number
    const prefix = (profile.invoice_prefix || 'SV').toUpperCase()
    const compact = month.replace('-', '')
    const sameMonth = invoices.filter((invoice) => invoice.period_start?.startsWith(month))
    return `${prefix}-${compact}-${String(sameMonth.length + 1).padStart(3, '0')}`
  }

  async function createAndPrintInvoice() {
    const client = clientMap.get(invoiceClient)
    if (!client) return setNotice({ type: 'error', text: 'Choose a client.' })
    if (!invoiceEntries.length) return setNotice({ type: 'error', text: 'There are no completed entries for that client and month.' })
    if (!client.billing_address) return setNotice({ type: 'error', text: 'Add the client billing address before creating the invoice.' })
    if (!profile.address) return setNotice({ type: 'error', text: 'Add your address in Invoice settings before creating the invoice.' })
    if (invoiceEntries.some((entry) => entry.currency !== invoiceEntries[0].currency)) {
      return setNotice({ type: 'error', text: 'This month contains entries in more than one currency. Split or correct those entries before invoicing.' })
    }
    const { periodStart, periodEnd } = monthBounds(invoiceMonth)
    const existing = invoices.find((invoice) => invoice.client_id === client.id && invoice.period_start === periodStart)
    const lineItems = invoiceEntries.map((entry) => ({
      time_entry_id: entry.id,
      started_at: entry.started_at,
      ended_at: entry.ended_at,
      description: entry.description || 'Professional services',
      duration_seconds: entrySeconds(entry),
      rate_minor: entry.rate_minor,
      currency: entry.currency,
      amount_minor: amountForEntry(entry),
    }))
    const payload = {
      owner_id: user.id,
      client_id: client.id,
      invoice_number: invoiceNumberFor(invoiceMonth, existing),
      issue_date: new Date().toISOString().slice(0, 10),
      period_start: periodStart,
      period_end: periodEnd,
      currency: invoiceCurrency,
      total_minor: lineItems.reduce((sum, item) => sum + item.amount_minor, 0),
      client_snapshot: {
        name: client.name,
        email: client.email,
        billing_address: client.billing_address,
        currency: invoiceCurrency,
      },
      sender_snapshot: {
        business_name: profile.business_name || 'Shane Velez',
        address: profile.address || '',
        email: profile.email || '',
        payment_instructions: profile.payment_instructions || '',
      },
      line_items: lineItems,
      updated_at: new Date().toISOString(),
    }
    const invoiceWindow = window.open('', '_blank')
    if (!invoiceWindow) return setNotice({ type: 'error', text: 'Your browser blocked the invoice window. Allow pop-ups for this site and try again.' })
    invoiceWindow.document.write('<p style="font-family:Arial;padding:32px">Preparing invoice…</p>')
    const ok = await runAction(async () => {
      const saved = await upsertRow('invoices', payload, 'owner_id,client_id,period_start')
      setInvoices((current) => {
        const without = current.filter((invoice) => invoice.id !== saved.id)
        return [saved, ...without]
      })
      printInvoice(saved, invoiceWindow)
    }, existing ? 'Invoice refreshed from the current entries.' : 'Invoice created and saved.')
    if (!ok) invoiceWindow.close()
  }

  async function doSignOut() {
    await signOut()
    window.location.reload()
  }

  const completedEntries = entries.filter((entry) => entry.ended_at)
  const monthEntries = completedEntries.filter((entry) => monthKey(entry.started_at) === currentMonth())
  const todayKey = new Date().toDateString()
  const todayEntries = completedEntries.filter((entry) => new Date(entry.started_at).toDateString() === todayKey)
  const monthHours = monthEntries.reduce((sum, entry) => sum + entrySeconds(entry), 0)
  const todayHours = todayEntries.reduce((sum, entry) => sum + entrySeconds(entry), 0)

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur md:px-7">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <a href="/" className="text-sm text-slate-500 hover:text-sky-300">Shane Velez</a>
              <span className="text-slate-700">/</span>
              <span className="text-sm font-bold text-slate-200">Time Tracker</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">{user.email}</span>
            <button onClick={doSignOut} className="text-xs font-semibold text-slate-400 hover:text-white">Sign out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-7">
        <nav className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70 p-1.5">
          {TABS.map((item) => (
            <button key={item} onClick={() => setTab(item)} className={`min-w-max flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${tab === item ? 'bg-sky-400 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>{item}</button>
          ))}
        </nav>

        {notice && <div className="mb-5"><Alert type={notice.type}>{notice.text}</Alert></div>}
        {loading ? <div className="py-20 text-center text-slate-500">Loading billing data…</div> : (
          <>
            {tab === 'Timer' && (
              <div className="space-y-6">
                <section className={`overflow-hidden rounded-3xl border p-6 md:p-8 ${runningEntry ? 'border-emerald-400/30 bg-emerald-400/[0.06]' : 'border-slate-800 bg-slate-900'}`}>
                  {runningEntry ? (
                    <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
                      <div>
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-300"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" /> Timer running</div>
                        <h1 className="text-3xl font-black md:text-4xl">{clientMap.get(runningEntry.client_id)?.name || 'Client'}</h1>
                        <p className="mt-2 text-slate-400">{runningEntry.description || 'No description'}</p>
                        <div className="mt-6 font-mono text-5xl font-black tracking-tight md:text-7xl">{formatDuration(entrySeconds(runningEntry, now))}</div>
                        <div className="mt-3 text-sm text-slate-400">Started {new Date(runningEntry.started_at).toLocaleString()} · {formatMoney(runningEntry.rate_minor, runningEntry.currency)}/hr</div>
                      </div>
                      <button disabled={busy} onClick={stopTimer} className="h-28 w-full rounded-2xl bg-red-500 px-8 text-xl font-black text-white shadow-xl shadow-red-950/30 transition hover:bg-red-400 disabled:opacity-40 lg:w-48">STOP</button>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-2 text-sm font-bold text-sky-300">Ready to work</div>
                      <h1 className="text-3xl font-black md:text-4xl">Start a timer</h1>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Once started, the database stores the start timestamp. You can close the site or shut down the computer; the timer is still running until you stop it.</p>
                      {!activeClients.length ? (
                        <div className="mt-6"><Alert>Add a client before starting your first timer.</Alert><PrimaryButton onClick={() => setTab('Clients')} className="mt-4">Add client</PrimaryButton></div>
                      ) : (
                        <div className="mt-7 grid gap-4 md:grid-cols-[1fr_1.4fr_auto] md:items-end">
                          <Field label="Client">
                            <SelectInput value={timerClient} onChange={(e) => setTimerClient(e.target.value)}>
                              {activeClients.map((client) => <option key={client.id} value={client.id}>{client.name} · {formatMoney(client.hourly_rate_minor, client.currency)}/hr</option>)}
                            </SelectInput>
                          </Field>
                          <Field label="What are you working on?">
                            <TextInput value={timerDescription} onChange={(e) => setTimerDescription(e.target.value)} placeholder="Optional description" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); startTimer() } }} />
                          </Field>
                          <PrimaryButton disabled={busy} onClick={startTimer} className="h-[42px] min-w-32">START</PrimaryButton>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">Today</div><div className="mt-2 text-3xl font-black">{(todayHours / 3600).toFixed(2)}h</div></div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">This month</div><div className="mt-2 text-3xl font-black">{(monthHours / 3600).toFixed(2)}h</div></div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">Billable this month</div><div className="mt-2 space-y-1">{moneyGroups(monthEntries).length ? moneyGroups(monthEntries).map(([currency, minor]) => <div key={currency} className="text-2xl font-black">{formatMoney(minor, currency)}</div>) : <div className="text-3xl font-black">—</div>}</div></div>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-black">Recent entries</h2><p className="text-sm text-slate-500">Your latest completed work.</p></div><button onClick={() => setTab('Entries')} className="text-sm font-semibold text-sky-400 hover:text-sky-300">View all</button></div>
                  <div className="divide-y divide-slate-800">
                    {completedEntries.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="grid gap-2 py-3 sm:grid-cols-[140px_1fr_auto_auto] sm:items-center">
                        <div className="text-sm text-slate-400">{new Date(entry.started_at).toLocaleDateString()}</div>
                        <div><div className="font-semibold">{clientMap.get(entry.client_id)?.name || 'Client'}</div><div className="text-sm text-slate-500">{entry.description || 'Professional services'}</div></div>
                        <div className="text-sm font-semibold">{formatDuration(entrySeconds(entry))}</div>
                        <div className="text-sm font-bold">{formatMoney(amountForEntry(entry), entry.currency)}</div>
                      </div>
                    ))}
                    {!completedEntries.length && <div className="py-8 text-center text-sm text-slate-500">No completed time entries yet.</div>}
                  </div>
                </section>
              </div>
            )}

            {tab === 'Clients' && (
              <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="mb-4"><h1 className="text-2xl font-black">Clients</h1><p className="mt-1 text-sm text-slate-500">Rates are copied onto each time entry when work starts.</p></div>
                  <div className="divide-y divide-slate-800">
                    {clients.map((client) => (
                      <div key={client.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div><div className="flex items-center gap-2"><span className="font-bold">{client.name}</span>{!client.active && <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">Inactive</span>}</div><div className="mt-1 text-sm text-slate-500">{formatMoney(client.hourly_rate_minor, client.currency)}/hr · {client.currency}</div></div>
                        <SecondaryButton onClick={() => editClient(client)}>Edit</SecondaryButton>
                      </div>
                    ))}
                    {!clients.length && <div className="py-10 text-center text-sm text-slate-500">No clients yet.</div>}
                  </div>
                </section>

                <section className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <h2 className="text-lg font-black">{clientForm.id ? 'Edit client' : 'Add client'}</h2>
                  <form onSubmit={saveClient} className="mt-5 space-y-4">
                    <Field label="Client name"><TextInput required value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} /></Field>
                    <div className="grid grid-cols-[1fr_110px] gap-3">
                      <Field label="Hourly rate"><TextInput required type="number" min="0" step="0.01" value={clientForm.hourly_rate} onChange={(e) => setClientForm({ ...clientForm, hourly_rate: e.target.value })} /></Field>
                      <Field label="Currency"><SelectInput value={clientForm.currency} onChange={(e) => setClientForm({ ...clientForm, currency: e.target.value })}>{CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}</SelectInput></Field>
                    </div>
                    <Field label="Billing email"><TextInput type="email" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} /></Field>
                    <Field label="Billing address"><textarea rows="4" value={clientForm.billing_address} onChange={(e) => setClientForm({ ...clientForm, billing_address: e.target.value })} className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none focus:border-sky-400" /></Field>
                    <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={clientForm.active} onChange={(e) => setClientForm({ ...clientForm, active: e.target.checked })} /> Active client</label>
                    <div className="flex gap-2"><PrimaryButton disabled={busy} type="submit">{clientForm.id ? 'Save changes' : 'Add client'}</PrimaryButton>{clientForm.id && <SecondaryButton type="button" onClick={() => setClientForm(blankClient)}>Cancel</SecondaryButton>}</div>
                  </form>
                </section>
              </div>
            )}

            {tab === 'Entries' && (
              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-black">Time entries</h1><p className="mt-1 text-sm text-slate-500">Fix forgotten timers or add work you tracked elsewhere.</p></div><PrimaryButton onClick={newManualEntry}>+ Add manual entry</PrimaryButton></div>
                </section>

                {entryForm.client_id && (
                  <section className="rounded-2xl border border-sky-400/30 bg-slate-900 p-5">
                    <div className="flex items-center justify-between"><h2 className="text-lg font-black">{entryForm.id ? 'Edit entry' : 'Add manual entry'}</h2><button onClick={() => setEntryForm(blankEntry)} className="text-sm text-slate-500 hover:text-white">Close</button></div>
                    <form onSubmit={saveEntry} className="mt-5 grid gap-4 lg:grid-cols-2">
                      <Field label="Client"><SelectInput value={entryForm.client_id} onChange={(e) => entryClientChanged(e.target.value)}>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</SelectInput></Field>
                      <Field label="Description"><TextInput value={entryForm.description} onChange={(e) => setEntryForm({ ...entryForm, description: e.target.value })} /></Field>
                      <Field label="Start"><TextInput required type="datetime-local" value={entryForm.started_at} onChange={(e) => setEntryForm({ ...entryForm, started_at: e.target.value })} /></Field>
                      <Field label="End"><TextInput required type="datetime-local" value={entryForm.ended_at} onChange={(e) => setEntryForm({ ...entryForm, ended_at: e.target.value })} /></Field>
                      <Field label={`Historical rate (${entryForm.currency})`}><TextInput required type="number" min="0" step="0.01" value={entryForm.hourly_rate} onChange={(e) => setEntryForm({ ...entryForm, hourly_rate: e.target.value })} /></Field>
                      <div className="flex items-end gap-2"><PrimaryButton disabled={busy} type="submit">Save entry</PrimaryButton><SecondaryButton type="button" onClick={() => setEntryForm(blankEntry)}>Cancel</SecondaryButton></div>
                    </form>
                  </section>
                )}

                <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left text-sm">
                      <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Client / description</th><th className="px-4 py-3">Time</th><th className="px-4 py-3">Rate</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3"></th></tr></thead>
                      <tbody className="divide-y divide-slate-800">
                        {entries.map((entry) => (
                          <tr key={entry.id} className={entry.ended_at ? '' : 'bg-emerald-400/[0.05]'}>
                            <td className="px-4 py-3 text-slate-400"><div>{new Date(entry.started_at).toLocaleDateString()}</div><div className="text-xs text-slate-600">{new Date(entry.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div></td>
                            <td className="px-4 py-3"><div className="font-semibold">{clientMap.get(entry.client_id)?.name || 'Client'} {!entry.ended_at && <span className="ml-2 text-xs font-bold text-emerald-300">RUNNING</span>}</div><div className="mt-0.5 text-xs text-slate-500">{entry.description || 'Professional services'}</div></td>
                            <td className="px-4 py-3 font-semibold">{formatDuration(entrySeconds(entry, now))}</td>
                            <td className="px-4 py-3">{formatMoney(entry.rate_minor, entry.currency)}/hr</td>
                            <td className="px-4 py-3 font-bold">{formatMoney(amountForEntry(entry), entry.currency)}</td>
                            <td className="px-4 py-3 text-right">{entry.ended_at ? <div className="flex justify-end gap-2"><button onClick={() => editEntry(entry)} className="text-sky-400 hover:text-sky-300">Edit</button><button onClick={() => removeEntry(entry)} className="text-red-400 hover:text-red-300">Delete</button></div> : <button onClick={() => { setTab('Timer'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="text-emerald-300">Open timer</button>}</td>
                          </tr>
                        ))}
                        {!entries.length && <tr><td colSpan="6" className="px-4 py-12 text-center text-slate-500">No time entries yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {tab === 'Invoices' && (
              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6">
                  <h1 className="text-2xl font-black">Invoices</h1>
                  <p className="mt-1 text-sm text-slate-500">Choose a client and month. The saved invoice is a snapshot, so future edits do not silently rewrite old bills.</p>
                  <div className="mt-6 grid gap-4 md:grid-cols-[1fr_190px_auto] md:items-end">
                    <Field label="Client"><SelectInput value={invoiceClient} onChange={(e) => setInvoiceClient(e.target.value)}><option value="">Choose client</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</SelectInput></Field>
                    <Field label="Month"><TextInput type="month" value={invoiceMonth} onChange={(e) => setInvoiceMonth(e.target.value)} /></Field>
                    <PrimaryButton disabled={busy || !invoiceEntries.length} onClick={createAndPrintInvoice}>Export PDF</PrimaryButton>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="text-lg font-black">Invoice preview</h2><p className="text-sm text-slate-500">{invoiceEntries.length} completed {invoiceEntries.length === 1 ? 'entry' : 'entries'}</p></div><div className="text-right"><div className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">Amount due</div><div className="mt-1 text-3xl font-black">{formatMoney(invoiceTotal, invoiceCurrency)}</div></div></div>
                  <div className="divide-y divide-slate-800">
                    {invoiceEntries.map((entry) => <div key={entry.id} className="grid gap-2 py-3 sm:grid-cols-[120px_1fr_auto_auto] sm:items-center"><div className="text-sm text-slate-400">{new Date(entry.started_at).toLocaleDateString()}</div><div className="text-sm">{entry.description || 'Professional services'}</div><div className="text-sm font-semibold">{formatDuration(entrySeconds(entry))}</div><div className="text-sm font-bold">{formatMoney(amountForEntry(entry), entry.currency)}</div></div>)}
                    {!invoiceEntries.length && <div className="py-10 text-center text-sm text-slate-500">No completed entries for this client and month.</div>}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <h2 className="mb-4 text-lg font-black">Saved invoices</h2>
                  <div className="divide-y divide-slate-800">
                    {invoices.map((invoice) => <div key={invoice.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-bold">{invoice.invoice_number} · {invoice.client_snapshot?.name || clientMap.get(invoice.client_id)?.name}</div><div className="mt-1 text-sm text-slate-500">{invoice.period_start} → {invoice.period_end} · {formatMoney(invoice.total_minor, invoice.currency)}</div></div><SecondaryButton onClick={() => printInvoice(invoice)}>Export PDF</SecondaryButton></div>)}
                    {!invoices.length && <div className="py-10 text-center text-sm text-slate-500">No invoices saved yet.</div>}
                  </div>
                </section>
              </div>
            )}

            {tab === 'Settings' && (
              <section className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-7">
                <h1 className="text-2xl font-black">Invoice settings</h1>
                <p className="mt-1 text-sm leading-6 text-slate-500">These details appear on new invoices. You are not marked as VAT registered and VAT is not added.</p>
                <form onSubmit={saveProfile} className="mt-6 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2"><Field label="Your / business name"><TextInput value={profile.business_name || ''} onChange={(e) => setProfile({ ...profile, business_name: e.target.value })} /></Field><Field label="Invoice prefix"><TextInput maxLength="10" value={profile.invoice_prefix || ''} onChange={(e) => setProfile({ ...profile, invoice_prefix: e.target.value })} /></Field></div>
                  <Field label="Your email"><TextInput type="email" value={profile.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></Field>
                  <Field label="Your address"><textarea rows="4" value={profile.address || ''} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none focus:border-sky-400" /></Field>
                  <Field label="Payment details / instructions"><textarea rows="5" placeholder={'Example:\nPlease pay by bank transfer within 14 days.\nAccount name: …'} value={profile.payment_instructions || ''} onChange={(e) => setProfile({ ...profile, payment_instructions: e.target.value })} className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none focus:border-sky-400" /></Field>
                  <PrimaryButton disabled={busy} type="submit">Save invoice settings</PrimaryButton>
                </form>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default function TimeTracker() {
  const [authState, setAuthState] = useState({ loading: true, user: null })

  useEffect(() => {
    async function init() {
      if (!isSupabaseConfigured) {
        setAuthState({ loading: false, user: null })
        return
      }
      consumeSessionFromUrl()
      const user = await getCurrentUser()
      setAuthState({ loading: false, user })
    }
    init()
  }, [])

  if (!isSupabaseConfigured) return <SetupRequired />
  if (authState.loading) return <main className="min-h-screen bg-slate-950 py-32 text-center text-slate-500">Checking session…</main>
  if (!authState.user) return <Login />
  return <TimeTrackerApp user={authState.user} />
}
