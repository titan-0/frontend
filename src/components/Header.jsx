import React from 'react'

export default function Header({ onRefresh, onNewOrder, darkMode, onToggleDarkMode }) {
  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 text-white shadow dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
      <div className="container-max py-2 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white/15 grid place-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3v5h.01M21 3v5h-.01M3 21v-5h.01M21 21v-5h-.01M8 7h8m-8 5h8m-8 5h8" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Open Positions</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onToggleDarkMode}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            {darkMode ? 'Light' : 'Dark'}
          </button>
          <button
            onClick={onNewOrder}
            className="inline-flex items-center gap-1.5 rounded-full bg-white text-brand-700 px-3 py-1.5 text-sm font-medium hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 dark:bg-white dark:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
            </svg>
            New Order
          </button>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.023 9.348h4.992V4.355M21 12a9 9 0 11-3.67-7.326"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </header>
  )
}
