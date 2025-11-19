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

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETE': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'OPEN': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="p-2">
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-xs table-fixed" style={{width: '100%'}}>
          <colgroup>
            <col style={{width: '60px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '75px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '110px'}} />
            <col style={{width: '70px'}} />
            <col style={{width: '75px'}} />
            <col style={{width: '55px'}} />
            <col style={{width: '60px'}} />
            <col style={{width: '70px'}} />
            <col style={{width: '60px'}} />
            <col style={{width: '70px'}} />
            <col style={{width: '75px'}} />
            <col style={{width: '75px'}} />
            <col style={{width: '55px'}} />
            <col style={{width: '70px'}} />
            <col style={{width: '120px'}} />
            <col style={{width: '120px'}} />
          </colgroup>
          <thead className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <tr className="sticky top-[0] z-0 bg-gray-50 dark:bg-gray-800">
              <th className="px-1.5 py-1">
                <input
                  type="text"
                  placeholder="ID"
                  value={localFilters.id || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, id: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </th>
              <th className="px-1.5 py-1">
                <input
                  type="text"
                  placeholder="Order"
                  value={localFilters.order_id || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, order_id: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </th>
              <th className="px-1.5 py-1">
                <input
                  type="text"
                  placeholder="Client"
                  value={localFilters.client_id || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, client_id: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </th>
              <th className="px-1.5 py-1">
                <input
                  type="text"
                  placeholder="Symbol"
                  value={localFilters.ticker || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, ticker: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </th>
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1">
                <input
                  type="text"
                  placeholder="Broker"
                  value={localFilters.broker || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, broker: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </th>
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1">
                <select
                  value={localFilters.status || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, status: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-1 py-0.5 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">All</option>
                  <option value="COMPLETE">COMPLETE</option>
                  <option value="OPEN">OPEN</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </th>
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
            </tr>
            <tr className="sticky top-[30px] z-0 bg-gray-50 border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <th className="px-1.5 py-1.5 text-left truncate text-xs">ID</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Order</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Client</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Symbol</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Order Time</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Exch</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Type</th>
              <th className="px-1.5 py-1.5 text-right truncate text-xs">Qty</th>
              <th className="px-1.5 py-1.5 text-right truncate text-xs">Price</th>
              <th className="px-1.5 py-1.5 text-right truncate text-xs">Trigger</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Prod</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Broker</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Account</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Status</th>
              <th className="px-1.5 py-1.5 text-right truncate text-xs">Filled</th>
              <th className="px-1.5 py-1.5 text-right truncate text-xs">Avg</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Status Msg</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Exch Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && rows.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`sk-${i}`} className="animate-pulse">
                  {Array.from({ length: 18 }).map((__, j) => (
                    <td key={j} className="px-1.5 py-2"><div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" /></td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="18" className="px-1.5 py-8 text-center text-gray-600 dark:text-gray-400">
                  <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-gray-100 text-gray-400 grid place-items-center dark:bg-gray-700 dark:text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h8m-8 5h5M6 5a2 2 0 00-2 2v10l3-2 3 2 3-2 3 2 3-2 3 2V7a2 2 0 00-2-2H6z" />
                    </svg>
                  </div>
                  <p className="text-xs">No broker orders found</p>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.id}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.order_id}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.client_id}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 font-medium truncate text-xs dark:text-gray-200">{row.tradingsymbol}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{formatDateTime(row.order_timestamp)}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.exchange}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.order_type}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 text-right truncate text-xs dark:text-gray-300">{row.quantity || 0}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 text-right truncate text-xs dark:text-gray-300">{row.price?.toFixed(2) || '-'}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 text-right truncate text-xs dark:text-gray-300">{row.trigger_price?.toFixed(2) || '-'}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.product}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.broker}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.brokeraccount}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate">
                    <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 text-right truncate text-xs dark:text-gray-300">{row.filled_quantity || 0}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 text-right truncate text-xs dark:text-gray-300">{row.average_price?.toFixed(2) || '-'}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300" title={row.status_message}>{row.status_message || '-'}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{formatDateTime(row.exchange_timestamp)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
