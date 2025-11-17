import React from 'react'

export default function SlideOver({ open, onClose, title, children }) {
  return (
    <div className={"fixed inset-0 z-50 " + (open ? '' : 'pointer-events-none') } aria-hidden={!open}>
      {/* Overlay */}
      <div
        className={(open ? 'opacity-100' : 'opacity-0') + ' transition-opacity duration-200 ease-out absolute inset-0 bg-black/40'}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={
          'absolute top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-out ' +
          (open ? 'translate-x-0' : 'translate-x-full')
        }
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="inline-flex items-center rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Close panel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
          {children}
        </div>
      </div>
    </div>
  )
}
