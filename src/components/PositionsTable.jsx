import React, { useEffect, useMemo, useState } from 'react'
import { exitPositions } from '../lib/api'

export default function PositionsTable({ data, onChanged, loading = false, loadingMore = false, filters = {}, onFiltersChange }) {
  const [submitting, setSubmitting] = useState(false)
  const [selected, setSelected] = useState({})
  const [localFilters, setLocalFilters] = useState(filters)

  // Sync local filters with parent
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  // Debounce filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const changed = Object.keys(localFilters).some(k => (localFilters[k] || '') !== (filters[k] || ''))
      if (changed) {
        onFiltersChange?.(localFilters)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [localFilters, onFiltersChange, filters])

  const rows = Array.isArray(data) ? data : []

  const selectedIds = useMemo(() => Object.keys(selected).filter((k) => selected[k]), [selected])

  const totalOpenQty = useMemo(() => {
    return rows.reduce((acc, r) => acc + Math.max(0, (Number(r.quantity_filled || 0) - Number(r.quantity_exited || 0))), 0)
  }, [rows])

  function toggle(id, value) {
    setSelected((prev) => ({ ...prev, [id]: value ?? !prev[id] }))
  }

  async function handleExit() {
    if (!selectedIds.length) return
    setSubmitting(true)
    try {
      await exitPositions(selectedIds.map((id) => ({ order_id: id })))
      setSelected({})
      onChanged?.()
    } catch (e) {
      alert(e?.message || 'Failed to exit selected positions')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-end gap-4 text-sm text-gray-600">
        <div>
          Open Qty Total: <span className="font-semibold">{totalOpenQty}</span>
        </div>
        <button
          onClick={handleExit}
          disabled={!selectedIds.length || submitting}
          className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 hover:bg-red-700"
        >
          Exit Selected ({selectedIds.length || 0})
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm table-fixed" style={{width: '100%'}}>
          <colgroup>
            <col style={{width: '48px'}} />
            <col style={{width: '100px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '60px'}} />
            <col style={{width: '70px'}} />
            <col style={{width: '70px'}} />
            <col style={{width: '90px'}} />
            <col style={{width: '70px'}} />
            <col style={{width: '90px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '90px'}} />
            <col style={{width: '100px'}} />
            <col style={{width: '110px'}} />
            <col style={{width: '100px'}} />
          </colgroup>
          <thead className="bg-gray-50 text-gray-700">
            <tr className="sticky top-[0] z-0 bg-gray-50">
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5">
                <input
                  type="text"
                  placeholder="Ticker"
                  value={localFilters.ticker || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, ticker: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </th>
              <th className="px-3 py-1.5">
                <select
                  value={localFilters.action || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, action: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">All</option>
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </th>
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5">
                <select
                  value={localFilters.product || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, product: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">All</option>
                  <option value="NRML">NRML</option>
                  <option value="MIS">MIS</option>
                </select>
              </th>
              <th className="px-3 py-1.5">
                <input
                  type="text"
                  placeholder="Broker"
                  value={localFilters.broker || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, broker: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </th>
              <th className="px-3 py-1.5">
                <input
                  type="text"
                  placeholder="Account"
                  value={localFilters.account || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, account: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </th>
              <th className="px-3 py-1.5">
                <input
                  type="text"
                  placeholder="Client ID"
                  value={localFilters.client_id || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, client_id: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </th>
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
            </tr>
            <tr className="sticky top-[36px] z-0 bg-gray-50 border-t border-gray-200">
              <th className="px-3 py-2 text-left">
                <input
                  type="checkbox"
                  aria-label="Select all"
                  onChange={(e) => {
                    const all = {}
                    rows.forEach((r) => { all[r.order_id] = e.target.checked })
                    setSelected(all)
                  }}
                />
              </th>
              <th className="px-3 py-2 text-left truncate">Order ID</th>
              <th className="px-3 py-2 text-left truncate">Ticker</th>
              <th className="px-3 py-2 text-left truncate">Action</th>
              <th className="px-3 py-2 text-left truncate">Qty</th>
              <th className="px-3 py-2 text-left truncate">Filled</th>
              <th className="px-3 py-2 text-left truncate">Exited</th>
              <th className="px-3 py-2 text-left truncate">Open Qty</th>
              <th className="px-3 py-2 text-left truncate">Price</th>
              <th className="px-3 py-2 text-left truncate">Product</th>
              <th className="px-3 py-2 text-left truncate">Broker</th>
              <th className="px-3 py-2 text-left truncate">Account</th>
              <th className="px-3 py-2 text-left truncate">Client ID</th>
              <th className="px-3 py-2 text-left truncate">Entry Date</th>
              <th className="px-3 py-2 text-left truncate">Exit Date</th>
              
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`sk-${i}`} className="animate-pulse">
                  <td className="px-3 py-3"><div className="h-4 w-4 rounded bg-gray-200" /></td>
                  {Array.from({ length: 14 }).map((__, j) => (
                    <td key={j} className="px-3 py-3"><div className="h-4 w-full rounded bg-gray-200" /></td>
                  ))}
                </tr>
              ))
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={15} className="px-3 py-10 text-center text-gray-600">
                  <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-gray-100 text-gray-400 grid place-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h8m-8 5h5M6 5a2 2 0 00-2 2v10l3-2 3 2 3-2 3 2 3-2 3 2V7a2 2 0 00-2-2H6z" />
                    </svg>
                  </div>
                  <div className="font-medium">No open positions</div>
                  <div className="text-sm text-gray-500">Place a new order to see it here.</div>
                </td>
              </tr>
            )}
            {!loading && rows.map((r) => {
              const openQty = Math.max(0, (Number(r.quantity_filled || 0) - Number(r.quantity_exited || 0)))
              return (
                <tr key={r.order_id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <input type="checkbox" checked={!!selected[r.order_id]} onChange={() => toggle(r.order_id)} />
                  </td>
                  <td className="px-3 py-2 font-mono text-xs truncate" title={r.order_id}>{r.order_id}</td>
                  <td className="px-3 py-2 truncate" title={r.ticker}>{r.ticker}</td>
                  <td className="px-3 py-2">
                    <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold " + (r.action === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                      {r.action}
                    </span>
                  </td>
                  <td className="px-3 py-2 truncate">{r.quantity}</td>
                  <td className="px-3 py-2 truncate">{r.quantity_filled}</td>
                  <td className="px-3 py-2 truncate">{r.quantity_exited}</td>
                  <td className="px-3 py-2 font-semibold truncate">{openQty}</td>
                  <td className="px-3 py-2 truncate">{r.price ?? '-'}</td>
                  <td className="px-3 py-2 truncate" title={r.product}>{r.product}</td>
                  <td className="px-3 py-2 truncate" title={r.broker}>{r.broker}</td>
                  <td className="px-3 py-2 truncate" title={r.brokeraccount}>{r.brokeraccount}</td>
                  <td className="px-3 py-2 truncate" title={r.client_id}>{r.client_id}</td>
                  <td className="px-3 py-2 truncate" title={r.date_entrylast}>{r.date_entrylast || '-'}</td>
                  <td className="px-3 py-2 truncate" title={r.date_exit}>{r.date_exit || '-'}</td>
                </tr>
              )
            })}

            {!loading && loadingMore && (
              Array.from({ length: 2 }).map((_, i) => (
                <tr key={`skm-${i}`} className="animate-pulse">
                  <td className="px-3 py-3"><div className="h-4 w-4 rounded bg-gray-200" /></td>
                  {Array.from({ length: 14 }).map((__, j) => (
                    <td key={j} className="px-3 py-3"><div className="h-4 w-full rounded bg-gray-200" /></td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
