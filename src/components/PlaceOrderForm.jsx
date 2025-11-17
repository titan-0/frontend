import React, { useMemo, useState } from 'react'
import { placeOrder } from '../lib/api'

const defaultForm = {
  alias: '',
  exchange: '',
  ticker: '',
  action: 'SELL',
  quantity: 1,
  price: '',
  trigger_price: '',
  stoploss_price: '',
  stoploss_trigger_price: '',
  takeprofit_price: '',
  product: 'NRML',
  ordertype: 'PositionalOrder',
}

export default function PlaceOrderForm({ aliases = [], onSubmitted }) {
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function update(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await placeOrder(form)
      setForm(defaultForm)
      onSubmitted?.()
    } catch (e) {
      setError(e?.message || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-800">{error}</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Exchange</label>
          <input value={form.exchange} onChange={(e) => update('exchange', e.target.value)} placeholder="e.g., NFO" className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Alias</label>
          <select value={form.alias} onChange={(e) => update('alias', e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
            <option value="" disabled>Select alias</option>
            {aliases.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ticker</label>
          <input value={form.ticker} onChange={(e) => update('ticker', e.target.value)} required placeholder="e.g., NIFTY24NOVFUT" className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Action</label>
          <select value={form.action} onChange={(e) => update('action', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input type="number" min="1" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input type="number" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="Leave blank for market" className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Trigger Price</label>
          <input type="number" step="0.01" value={form.trigger_price} onChange={(e) => update('trigger_price', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Product</label>
          <select value={form.product} onChange={(e) => update('product', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500">
            <option value="NRML">NRML</option>
            <option value="MIS">MIS</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stop-loss Price</label>
          <input type="number" step="0.01" value={form.stoploss_price} onChange={(e) => update('stoploss_price', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stop-loss Trigger Price</label>
          <input type="number" step="0.01" value={form.stoploss_trigger_price} onChange={(e) => update('stoploss_trigger_price', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Take-profit Price</label>
          <input type="number" step="0.01" value={form.takeprofit_price} onChange={(e) => update('takeprofit_price', e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Order Type</label>
          <input value={form.ordertype} onChange={(e) => update('ordertype', e.target.value)} readOnly className="mt-1 w-full rounded-md border-gray-200 bg-gray-50 shadow-sm" />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {submitting ? 'Placing…' : 'Place Order'}
        </button>
      </div>
    </form>
  )
}
