import React, { useEffect, useRef, useState, useCallback } from 'react'
import Header from './components/Header'
import PositionsTable from './components/PositionsTable'
import InternalOrdersTable from './components/InternalOrdersTable'
import BrokerOrdersTable from './components/BrokerOrdersTable'
import TradesTable from './components/TradesTable'
import PlaceOrderForm from './components/PlaceOrderForm'
import SlideOver from './components/SlideOver'
import { getAliases, getPositions, getInternalOrders, getBrokerOrders, getTrades } from './lib/api'

export default function App() {
  const PAGE_SIZE = 20
  const [activeTab, setActiveTab] = useState('positions')
  const [aliases, setAliases] = useState([])
  const [positions, setPositions] = useState([])
  const [internalOrders, setInternalOrders] = useState([])
  const [brokerOrders, setBrokerOrders] = useState([])
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [orderOpen, setOrderOpen] = useState(false)
  const [filters, setFilters] = useState({ broker: '', client_id: '', ticker: '', product: '', action: '', account: '', status: '' })
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const loadMoreRef = useRef(null)

  // Keep AbortController in a ref so we can cancel previous requests
  const abortRef = useRef(null)

  // Update dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // Centralized loadData: fetch aliases (once) and data for active tab
  // append: whether to append results (loadMore) or replace (fresh load)
  const loadData = useCallback(async (pageToLoad = 1, append = false) => {
    // Cancel prior request(s)
    if (abortRef.current) {
      abortRef.current.abort()
    }
    const ac = new AbortController()
    abortRef.current = ac

    if (!append) {
      setLoading(true)
      setError('')
    } else {
      setLoadingMore(true)
    }

    try {
      // Fetch data based on active tab
      let dataPromise
      switch (activeTab) {
        case 'positions':
          dataPromise = getPositions(filters, { page: pageToLoad, limit: PAGE_SIZE, signal: ac.signal })
          break
        case 'internal':
          dataPromise = getInternalOrders(filters, { page: pageToLoad, limit: PAGE_SIZE, signal: ac.signal })
          break
        case 'broker':
          dataPromise = getBrokerOrders(filters, { page: pageToLoad, limit: PAGE_SIZE, signal: ac.signal })
          break
        case 'trades':
          dataPromise = getTrades(filters, { page: pageToLoad, limit: PAGE_SIZE, signal: ac.signal })
          break
        default:
          dataPromise = Promise.resolve([])
      }

      const [a, data] = await Promise.all([
        getAliases({ signal: ac.signal }),
        dataPromise
      ])

      // Update aliases only on fresh load
      if (!append) {
        setAliases(a)
      }

      // Update the appropriate state based on active tab
      if (!append) {
        switch (activeTab) {
          case 'positions':
            setPositions(data)
            break
          case 'internal':
            setInternalOrders(data)
            break
          case 'broker':
            setBrokerOrders(data)
            break
          case 'trades':
            setTrades(data)
            break
        }
        setPage(pageToLoad)
      } else {
        switch (activeTab) {
          case 'positions':
            setPositions((prev) => [...prev, ...data])
            break
          case 'internal':
            setInternalOrders((prev) => [...prev, ...data])
            break
          case 'broker':
            setBrokerOrders((prev) => [...prev, ...data])
            break
          case 'trades':
            setTrades((prev) => [...prev, ...data])
            break
        }
        setPage(pageToLoad)
      }

      // If server returns fewer than PAGE_SIZE, then no more pages
      setHasMore((data?.length || 0) === PAGE_SIZE)
    } catch (e) {
      // Ignore abort errors (they're expected during cancellation)
      if (e?.name === 'AbortError') return
      setError(e?.message || 'Failed to load data')
    } finally {
      if (!append) setLoading(false)
      setLoadingMore(false)
      // clear abortRef if this request finished normally
      if (abortRef.current === ac) abortRef.current = null
    }
  }, [filters, activeTab])

  // loadMore increments page and appends
  async function loadMore() {
    if (loading || loadingMore || !hasMore) return
    const nextPage = page + 1
    await loadData(nextPage, true)
  }

  // Initial load + periodic refresh that respects latest filters (by using loadData from deps)
  useEffect(() => {
    // On filter changes or tab changes we want a fresh load starting at page 1
    loadData(1, false)
    const id = setInterval(() => loadData(1, false), 15000) // 2.5 minutes
    return () => {
      clearInterval(id)
      if (abortRef.current) abortRef.current.abort()
    }
  }, [loadData])

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setPage(1)
    setHasMore(true)
    setError('')
    setFilters({ broker: '', client_id: '', ticker: '', product: '', action: '', account: '', status: '' })
  }

  // IntersectionObserver: observe the sentinel element once it mounts, re-register when deps change
  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        loadMore()
      }
    }, { root: null, rootMargin: '200px', threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
    // We include the states that should cause re-observation (hasMore etc.)
  }, [hasMore, loading, loadingMore, page, filters])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header 
        onRefresh={() => loadData(1, false)} 
        onNewOrder={() => setOrderOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(prev => !prev)}
      />

      <main className="container-max py-3">
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-3 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => handleTabChange('positions')}
              className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium ${
                activeTab === 'positions'
                  ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
              }`}
            >
              Open Positions
            </button>
            <button
              onClick={() => handleTabChange('internal')}
              className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium ${
                activeTab === 'internal'
                  ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
              }`}
            >
              Internal Orders
            </button>
            <button
              onClick={() => handleTabChange('broker')}
              className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium ${
                activeTab === 'broker'
                  ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
              }`}
            >
              Broker Orders
            </button>
            <button
              onClick={() => handleTabChange('trades')}
              className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium ${
                activeTab === 'trades'
                  ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
              }`}
            >
              Trades
            </button>
          </nav>
        </div>

        <section className="grid grid-cols-1">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="card-header dark:border-gray-700">
                <h2 className="section-title dark:text-gray-100">
                  {activeTab === 'positions' && 'Open Positions'}
                  {activeTab === 'internal' && 'Internal Orders'}
                  {activeTab === 'broker' && 'Broker Orders'}
                  {activeTab === 'trades' && 'Trades'}
                </h2>
                {loading && <span className="text-sm text-gray-500">Refreshing…</span>}
              </div>

              {activeTab === 'positions' && (
                <PositionsTable
                  data={positions}
                  onChanged={() => loadData(1, false)}
                  loading={loading}
                  loadingMore={loadingMore}
                  filters={filters}
                  onFiltersChange={(newFilters) => {
                    setFilters(newFilters)
                    setPage(1)
                    setHasMore(true)
                    setError('')
                    loadData(1, false)
                  }}
                />
              )}

              {activeTab === 'internal' && (
                <InternalOrdersTable
                  data={internalOrders}
                  loading={loading}
                  loadingMore={loadingMore}
                  filters={filters}
                  onFiltersChange={(newFilters) => {
                    setFilters(newFilters)
                    setPage(1)
                    setHasMore(true)
                    setError('')
                    loadData(1, false)
                  }}
                />
              )}

              {activeTab === 'broker' && (
                <BrokerOrdersTable
                  data={brokerOrders}
                  loading={loading}
                  loadingMore={loadingMore}
                  filters={filters}
                  onFiltersChange={(newFilters) => {
                    setFilters(newFilters)
                    setPage(1)
                    setHasMore(true)
                    setError('')
                    loadData(1, false)
                  }}
                />
              )}

              {activeTab === 'trades' && (
                <TradesTable
                  data={trades}
                  loading={loading}
                  loadingMore={loadingMore}
                  filters={filters}
                  onFiltersChange={(newFilters) => {
                    setFilters(newFilters)
                    setPage(1)
                    setHasMore(true)
                    setError('')
                    loadData(1, false)
                  }}
                />
              )}

              <div className="p-2 text-center text-xs text-gray-500" ref={loadMoreRef}>
                {hasMore ? ' ' : 'No more results'}
              </div>
            </div>
          </div>
        </section>

        <SlideOver open={orderOpen} onClose={() => setOrderOpen(false)} title="Place Order">
          <PlaceOrderForm
            aliases={aliases}
            onSubmitted={() => {
              setOrderOpen(false)
              loadData(1, false)
            }}
          />
        </SlideOver>
      </main>

      {loadingMore && (
        <div className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-gray-900/90 text-white px-3 py-1.5 shadow-lg flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin text-white/90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-sm">Loading more…</span>
        </div>
      )}
    </div>
  )
}

