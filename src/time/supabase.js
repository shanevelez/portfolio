const rawUrl = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_URL = rawUrl.replace(/\/$/, '')
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const SESSION_KEY = 'sv_time_tracker_session_v1'

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

function authHeaders(accessToken) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  }
}

function saveSession(session) {
  if (!session) {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
  const normalized = {
    ...session,
    expires_at: session.expires_at || Math.floor(Date.now() / 1000) + Number(session.expires_in || 3600),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(normalized))
  return normalized
}

export function readStoredSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function consumeSessionFromUrl() {
  if (!window.location.hash) return readStoredSession()
  const params = new URLSearchParams(window.location.hash.slice(1))
  const accessToken = params.get('access_token')
  const refreshToken = params.get('refresh_token')
  if (!accessToken || !refreshToken) return readStoredSession()

  const session = saveSession({
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: params.get('token_type') || 'bearer',
    expires_in: Number(params.get('expires_in') || 3600),
  })
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
  return session
}

async function refreshSession(session) {
  if (!session?.refresh_token) return null
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  })
  if (!response.ok) {
    saveSession(null)
    return null
  }
  return saveSession(await response.json())
}

export async function getValidSession() {
  let session = readStoredSession()
  if (!session) return null
  if (Number(session.expires_at || 0) <= Math.floor(Date.now() / 1000) + 60) {
    session = await refreshSession(session)
  }
  return session
}

export async function getCurrentUser() {
  const session = await getValidSession()
  if (!session) return null
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: authHeaders(session.access_token),
  })
  if (!response.ok) {
    if (response.status === 401) saveSession(null)
    return null
  }
  return response.json()
}

export async function sendMagicLink(email) {
  const redirectTo = `${window.location.origin}/time`
  const response = await fetch(`${SUPABASE_URL}/auth/v1/otp?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      email,
      create_user: true,
      data: {},
    }),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.msg || body.message || 'Could not send sign-in link.')
  }
}

export async function signOut() {
  const session = readStoredSession()
  if (session?.access_token) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: authHeaders(session.access_token),
    }).catch(() => {})
  }
  saveSession(null)
}

export async function dbRequest(path, options = {}) {
  const session = await getValidSession()
  if (!session) throw new Error('Your session has expired. Sign in again.')

  const headers = {
    ...authHeaders(session.access_token),
    ...(options.headers || {}),
  }
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const message = body.message || body.details || body.hint || `Database request failed (${response.status}).`
    throw new Error(message)
  }
  if (response.status === 204) return null
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export async function selectRows(table, query = 'select=*') {
  return dbRequest(`${table}?${query}`, { method: 'GET' })
}

export async function insertRow(table, row) {
  const rows = await dbRequest(table, {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(row),
  })
  return rows?.[0] || null
}

export async function updateRows(table, filter, changes) {
  return dbRequest(`${table}?${filter}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(changes),
  })
}

export async function deleteRows(table, filter) {
  return dbRequest(`${table}?${filter}`, {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' },
  })
}

export async function upsertRow(table, row, onConflict) {
  const query = onConflict ? `?on_conflict=${encodeURIComponent(onConflict)}` : ''
  const rows = await dbRequest(`${table}${query}`, {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(row),
  })
  return rows?.[0] || null
}
