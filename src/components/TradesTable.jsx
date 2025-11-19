import React, { useEffect, useState } from 'react'

export default function TradesTable({ data, loading = false, loadingMore = false, filters = {}, onFiltersChange }) {
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

  return (
    <div className="p-2">
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-xs table-fixed" style={{width: '100%'}}>
          <colgroup>
            <col style={{width: '70px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '75px'}} />
            <col style={{width: '80px'}} />
            <col style={{width: '65px'}} />
            <col style={{width: '60px'}} />
            <col style={{width: '55px'}} />
            <col style={{width: '60px'}} />
            <col style={{width: '70px'}} />
            <col style={{width: '110px'}} />
            <col style={{width: '100px'}} />
            <col style={{width: '100px'}} />
            <col style={{width: '100px'}} />
            <col style={{width: '100px'}} />
          </colgroup>
          <thead className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <tr className="sticky top-[0] z-0 bg-gray-50 dark:bg-gray-800">
              <th className="px-1.5 py-1">
                <input
                  type="text"
                  placeholder="Trade ID"
                  value={localFilters.trade_id || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, trade_id: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </th>
              <th className="px-1.5 py-1">
                <input
                  type="text"
                  placeholder="Ticker"
                  value={localFilters.ticker || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, ticker: e.target.value }))}
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
                  placeholder="Broker"
                  value={localFilters.broker || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, broker: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </th>
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1">
                <select
                  value={localFilters.action || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, action: e.target.value }))}
                  className="w-full rounded border border-gray-300 bg-white px-1 py-0.5 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">All</option>
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </th>
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
              <th className="px-1.5 py-1" />
            </tr>
            <tr className="sticky top-[30px] z-0 bg-gray-50 border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <th className="px-1.5 py-1.5 text-left truncate text-xs">ID</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Ticker</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Client</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Broker</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Account</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Product</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Action</th>
              <th className="px-1.5 py-1.5 text-right truncate text-xs">Qty</th>
              <th className="px-1.5 py-1.5 text-right truncate text-xs">Price</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Exch</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Exch Time</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Exch Order</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Broker Order</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Broker Trade</th>
              <th className="px-1.5 py-1.5 text-left truncate text-xs">Internal Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && rows.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`sk-${i}`} className="animate-pulse">
                  {Array.from({ length: 15 }).map((__, j) => (
                    <td key={j} className="px-1.5 py-2"><div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" /></td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="15" className="px-1.5 py-8 text-center text-gray-600 dark:text-gray-400">
                  <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-gray-100 text-gray-400 grid place-items-center dark:bg-gray-700 dark:text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h8m-8 5h5M6 5a2 2 0 00-2 2v10l3-2 3 2 3-2 3 2 3-2 3 2V7a2 2 0 00-2-2H6z" />
                    </svg>
                  </div>
                  <p className="text-xs">No trades found</p>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.trade_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.trade_id}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 font-medium truncate text-xs dark:text-gray-200">{row.ticker}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.client_id}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.broker}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.brokeraccount}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.product}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate">
                    <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-semibold ${
                      row.action === 'BUY' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {row.action}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 text-right truncate text-xs dark:text-gray-300">{row.quantity || 0}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 text-right truncate text-xs dark:text-gray-300">{row.price?.toFixed(2) || '-'}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.exchange}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{formatDateTime(row.exchange_timestamp)}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.exchange_order_id || '-'}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.broker_order_id || '-'}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.broker_trade_id || '-'}</td>
                  <td className="whitespace-nowrap px-1.5 py-1.5 truncate text-xs dark:text-gray-300">{row.internalorder_id || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
