import React, { useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'

/**
 * Reusable pagination component with page numbers, prev/next buttons.
 *
 * @param {{ currentPage: number, totalItems: number, itemsPerPage: number, onPageChange: (page: number) => void }} props
 */
function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const { darkMode } = useSelector((s) => s.ui)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const pages = useMemo(() => {
    const result = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    if (start > 1) {
      result.push(1)
      if (start > 2) result.push('...')
    }

    for (let i = start; i <= end; i++) {
      result.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) result.push('...')
      result.push(totalPages)
    }

    return result
  }, [currentPage, totalPages])

  const handlePrev = useCallback(() => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }, [currentPage, onPageChange])

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }, [currentPage, totalPages, onPageChange])

  if (totalPages <= 1) return null

  const btnBase = `px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95`
  const btnActive = `gradient-bg text-white shadow-lg`
  const btnInactive = darkMode
    ? 'bg-barca-dark-card text-gray-400 hover:bg-barca-dark-hover hover:text-white border border-barca-dark-border'
    : 'bg-barca-away-surface text-barca-away-text-muted hover:bg-barca-away-border/40 border border-barca-away-border'
  const btnDisabled = darkMode
    ? 'bg-barca-dark-card/50 text-gray-600 border border-barca-dark-border/50 cursor-not-allowed'
    : 'bg-barca-away-surface/50 text-barca-away-text-muted/50 border border-barca-away-border/50 cursor-not-allowed'

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className={`px-2 text-sm ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${btnBase} min-w-[40px] ${page === currentPage ? btnActive : btnInactive}`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}`}
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Page info */}
      <span className={`ml-3 text-xs ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
        {currentPage} / {totalPages}
      </span>
    </div>
  )
}

export default React.memo(Pagination)
