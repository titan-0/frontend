import React, { useMemo } from 'react'

export default function FiltersBar({ filters, onChange, onApply, onClear, aliases = [] }) {
  const update = (name, value) => onChange({ ...filters, [name]: value })

  const active = useMemo(() => Object.entries(filters).filter(([_, v]) => (v ?? '').toString().trim() !== ''), [filters])
  const clearKey = (key) => onChange({ ...filters, [key]: '' })

  return (
    <div className="space-y-4">
      {active.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Active filters:</span>
          {active.map(([k, v]) => (
            <button
              key={k}
              onClick={() => clearKey(k)}
              className="group inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100"
              title="Remove filter"
            >
              <span className="capitalize">{k.replace('_', ' ')}</span>:
              <span className="font-semibold">{v}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700">Broker</label>
          <input
            value={filters.broker || ''}
            onChange={(e) => update('broker', e.target.value)}
            placeholder="e.g., Zerodha"
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">Client ID</label>
          <input
            value={filters.client_id || ''}
            onChange={(e) => update('client_id', e.target.value)}
            placeholder="e.g., ABC123"
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">Ticker</label>
          <input
            value={filters.ticker || ''}
            onChange={(e) => update('ticker', e.target.value)}
            placeholder="e.g., NIFTY24NOVFUT"
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">Product</label>
          <select
            value={filters.product || ''}
            onChange={(e) => update('product', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            <option value="">All</option>
            <option value="NRML">NRML</option>
            <option value="MIS">MIS</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">Action</label>
          <select
            value={filters.action || ''}
            onChange={(e) => update('action', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            <option value="">All</option>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">Account (Alias)</label>
          <select
            value={filters.account || ''}
            onChange={(e) => update('account', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            <option value="">All</option>
            {aliases.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
        <button
          onClick={onClear}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          onClick={onApply}
          className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Apply Filters
        </button>
      </div>
      <p className="text-xs text-gray-500">Tip: You can remove a single filter by clicking its chip above.</p>
    </div>
  )
}
