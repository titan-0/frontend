const API_BASE = import.meta.env.VITE_API_BASE || '/api'

async function http(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

export async function getAliases() {
  // Expected: ["alias1", "alias2", ...]
  return http('GET', '/aliases')
}

export async function getPositions(filters = {}, opts = {}) {
  // Serialize non-empty filters into query string
  const params = new URLSearchParams()
  const upperKeys = new Set(['ticker', 'action', 'product', 'client_id', 'broker'])
  Object.entries(filters).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    let s = `${v}`.trim()
    if (!s) return
    if (upperKeys.has(k)) s = s.toUpperCase()
    params.set(k, s)
  })
  const page = Number(opts.page || 1)
  const limit = Number(opts.limit || 20)
  if (page) params.set('page', String(page))
  if (limit) params.set('limit', String(limit))
  const qs = params.toString()
  const path = qs ? `/positions_json?${qs}` : '/positions_json'
  return http('GET', path)
}

export async function placeOrder(form) {
  // Map frontend form to backend payload shape
  const body = {
    alias: form.alias,
    exchange: form.exchange || undefined,
    ticker: form.ticker,
    action: form.action,
    quantity: form.quantity ? Number(form.quantity) : undefined,
    price: form.price !== '' ? Number(form.price) : undefined,
    trigger_price: form.trigger_price !== '' ? Number(form.trigger_price) : undefined,
    stoploss_price: form.stoploss_price !== '' ? Number(form.stoploss_price) : undefined,
    stoploss_trigger_price: form.stoploss_trigger_price !== '' ? Number(form.stoploss_trigger_price) : undefined,
    takeprofit_price: form.takeprofit_price !== '' ? Number(form.takeprofit_price) : undefined,
    product: form.product,
    ordertype: form.ordertype || 'PositionalOrder',
  }
  return http('POST', '/place_order', body)
}

export async function exitPositions(orders) {
  // Backend accepts either a list or { positions: [...] }
  return http('POST', '/exit_position', { positions: orders })
}
