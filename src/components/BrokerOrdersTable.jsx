import React, { useEffect, useState } from 'react'

export default function BrokerOrdersTable({ data, loading = false, loadingMore = false, filters = {}, onFiltersChange }) {
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

  function formatDateTime(dateStr) {
    if (!dateStr) return '-'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
    } catch {
      return dateStr
    }
  }

  function getStatusColor(status) {
    switch (status?.toUpperCase()) {
      case 'COMPLETE': return 'bg-green-100 text-green-800'
      case 'OPEN': return 'bg-blue-100 text-blue-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-4">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm table-fixed" style={{width: '100%'}}>
          <colgroup>
            <col style={{width: '80px'}} />
            <col style={{width: '100px'}} />
            <col style={{width: '100px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '70px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '100px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '70px'}} />
            <col style={{width: '70px'}} />
            <col style={{width: '70px'}} />
            <col style={{width: '90px'}} />
            <col style={{width: '90px'}} />
            <col style={{width: '90px'}} />
            <col style={{width: '110px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '100px'}} />
            <col style={{width: '150px'}} />
            <col style={{width: '150px'}} />
            <col style={{width: '120px'}} />
            <col style={{width: '150px'}} />
          </colgroup>
          <thead className="bg-gray-50 text-gray-700">
            <tr className="sticky top-[0] z-0 bg-gray-50">
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5">
                <input
                  type="text"
                  placeholder="Order ID"
                  value={localFilters.order_id || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, order_id: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </th>
              <th className="px-3 py-1.5">
                <input
                  type="text"
                  placeholder="Symbol"
                  value={localFilters.ticker || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, ticker: e.target.value }))}
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
              <th className="px-3 py-1.5">
                <select
                  value={localFilters.status || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, status: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">All</option>
                  <option value="COMPLETE">COMPLETE</option>
                  <option value="OPEN">OPEN</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="CANCELLED">CANCELLED</option>
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
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
              <th className="px-3 py-1.5" />
            </tr>
            <tr className="sticky top-[36px] z-0 bg-gray-50 border-t border-gray-200">
              <th className="px-3 py-2 text-left truncate">ID</th>
              <th className="px-3 py-2 text-left truncate">Order ID</th>
              <th className="px-3 py-2 text-left truncate">Symbol</th>
              <th className="px-3 py-2 text-left truncate">Client ID</th>
              <th className="px-3 py-2 text-left truncate">Txn Type</th>
              <th className="px-3 py-2 text-left truncate">Product</th>
              <th className="px-3 py-2 text-left truncate">Status</th>
              <th className="px-3 py-2 text-left truncate">Broker</th>
              <th className="px-3 py-2 text-left truncate">Account</th>
              <th className="px-3 py-2 text-right truncate">Qty</th>
              <th className="px-3 py-2 text-right truncate">Filled</th>
              <th className="px-3 py-2 text-right truncate">Pending</th>
              <th className="px-3 py-2 text-right truncate">Price</th>
              <th className="px-3 py-2 text-right truncate">Avg Price</th>
              <th className="px-3 py-2 text-right truncate">Trigger Price</th>
              <th className="px-3 py-2 text-left truncate">Order Type</th>
              <th className="px-3 py-2 text-left truncate">Validity</th>
              <th className="px-3 py-2 text-left truncate">Variety</th>
              <th className="px-3 py-2 text-left truncate">Exchange</th>
              <th className="px-3 py-2 text-left truncate">Status Message</th>
              <th className="px-3 py-2 text-left truncate">Order Time</th>
              <th className="px-3 py-2 text-left truncate">Exchange Order ID</th>
              <th className="px-3 py-2 text-left truncate">Exchange Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && rows.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`sk-${i}`} className="animate-pulse">
                  {Array.from({ length: 23 }).map((__, j) => (
                    <td key={j} className="px-3 py-3"><div className="h-4 w-full rounded bg-gray-200" /></td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="23" className="px-3 py-10 text-center text-gray-600">
                  <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-gray-100 text-gray-400 grid place-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h8m-8 5h5M6 5a2 2 0 00-2 2v10l3-2 3 2 3-2 3 2 3-2 3 2V7a2 2 0 00-2-2H6z" />
                    </svg>
                  </div>
                  <p className="text-sm">No broker orders found</p>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-3 py-2.5 truncate">{row.id}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 truncate">{row.order_id}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 font-medium truncate">{row.tradingsymbol}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 truncate">{row.client_id}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 truncate">
                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${
                      row.transaction_type === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {row.transaction_type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 truncate">{row.product}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 truncate">
                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 truncate">{row.broker}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 truncate">{row.brokeraccount}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right truncate">{row.quantity || 0}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right truncate">{row.filled_quantity || 0}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right truncate">{row.pending_quantity || 0}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right truncate">{row.price?.toFixed(2) || '-'}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right truncate">{row.average_price?.toFixed(2) || '-'}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right truncate">{row.trigger_price?.toFixed(2) || '-'}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 truncate">{row.order_type}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 truncate">{row.validity}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 truncate">{row.variety}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 truncate">{row.exchange}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs truncate" title={row.status_message}>{row.status_message || '-'}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs truncate">{formatDateTime(row.order_timestamp)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs truncate">{row.exchange_order_id || '-'}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs truncate">{formatDateTime(row.exchange_timestamp)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
