import React, { useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import PositionsTable from './components/PositionsTable'
import PlaceOrderForm from './components/PlaceOrderForm'
import SlideOver from './components/SlideOver'
import { getAliases, getPositions } from './lib/api'

export default function App() {
  const PAGE_SIZE = 20
  const [aliases, setAliases] = useState([])
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [orderOpen, setOrderOpen] = useState(false)
  const [filters, setFilters] = useState({ broker: '', client_id: '', ticker: '', product: '', action: '', account: '' })
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loadMoreRef = useRef(null)

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const effectiveLimit = Math.min(page * PAGE_SIZE, 20)
      const [a, p] = await Promise.all([
        getAliases(),
        getPositions(filters, { page: 1, limit: effectiveLimit || PAGE_SIZE })
      ])
      setAliases(a)
      setPositions(p)
      setHasMore((p?.length || 0) >= Math.min(PAGE_SIZE, effectiveLimit))
      setPage(Math.ceil((p?.length || 0) / PAGE_SIZE) || 1)
    } catch (e) {
      setError(e?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  async function loadMore() {
    if (loading || loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const p = await getPositions(filters, { page: nextPage, limit: PAGE_SIZE })
      setPositions((prev) => [...prev, ...p])
      setPage(nextPage)
      setHasMore((p?.length || 0) === PAGE_SIZE)
    } catch (e) {
      // keep existing items; surface error subtly
      setError(e?.message || 'Failed to load more')
    } finally {
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    loadData()
    const id = setInterval(loadData, 150000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!loadMoreRef.current) return
    const el = loadMoreRef.current
    const io = new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        loadMore()
      }
    }, { root: null, rootMargin: '200px', threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [loadMoreRef.current, hasMore, loading, loadingMore, page, filters])

  return (
    <div>
      <Header onRefresh={loadData} onNewOrder={() => setOrderOpen(true)} />

      <main className="container-max py-6">
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-800">
            {error}
          </div>
        )}

        {/* Filters moved to a slide-over, opened from header */}

        <section className="grid grid-cols-1 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="card-header">
                <h2 className="section-title">Open Positions</h2>
                {loading && <span className="text-sm text-gray-500">Refreshing…</span>}
              </div>
              <PositionsTable
                data={positions}
                onChanged={loadData}
                loading={loading}
                loadingMore={loadingMore}
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters)
                  setPage(1)
                  setHasMore(true)
                  setLoading(true)
                  setError('')
                  getPositions(newFilters, { page: 1, limit: PAGE_SIZE })
                    .then((p) => {
                      setPositions(p)
                      setHasMore((p?.length || 0) === PAGE_SIZE)
                      setPage(1)
                    })
                    .catch((e) => setError(e?.message || 'Failed to load data'))
                    .finally(() => setLoading(false))
                }}
              />
              <div className="p-3 text-center text-sm text-gray-500" ref={loadMoreRef}>
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
              loadData()
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
