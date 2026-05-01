import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMatches } from '../redux/matchesSlice'
import { useDebounce } from '../hooks'
import { filterByCompetition, sortByDateDesc, sortByDateAsc } from '../utils/matchUtils'
import MatchCard from '../components/MatchCard'
import Pagination from '../components/Pagination'
import SkeletonCard from '../components/SkeletonCard'

const FILTERS = [
  { code: 'ALL', label: 'All' },
  { code: 'PD', label: 'La Liga' },
  { code: 'CL', label: 'Champions League' },
]

const ITEMS_PER_PAGE = 6

function Matches() {
  const dispatch = useDispatch()
  const { items: matches, loading } = useSelector((s) => s.matches)
  const { darkMode } = useSelector((s) => s.ui)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  // Debounced search value — 300ms delay
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (matches.length === 0) dispatch(fetchMatches())
  }, [dispatch, matches.length])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filter, debouncedSearch, statusFilter, sortOrder])

  // Filtered & sorted matches (memoized)
  const filtered = useMemo(() => {
    let result = filterByCompetition(matches, filter)

    if (statusFilter === 'FINISHED') result = result.filter((m) => m.status === 'FINISHED')
    else if (statusFilter === 'SCHEDULED') result = result.filter((m) => m.status === 'SCHEDULED')

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter((m) =>
        (m.homeTeam?.name || '').toLowerCase().includes(q) ||
        (m.awayTeam?.name || '').toLowerCase().includes(q) ||
        (m.competition?.name || '').toLowerCase().includes(q)
      )
    }

    if (sortOrder === 'oldest') result = sortByDateAsc(result)
    else result = sortByDateDesc(result)

    return result
  }, [matches, filter, statusFilter, debouncedSearch, sortOrder])

  // Paginated matches
  const paginatedMatches = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, currentPage])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="page-title">Matches</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} variant="match" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h1 className="page-title mb-1">Matches</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
            {filtered.length} match{filtered.length !== 1 ? 'es' : ''} found
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        {/* Competition filter */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f.code} onClick={() => setFilter(f.code)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95
                ${filter === f.code ? 'gradient-bg filter-active' : 'filter-inactive'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-2">
          {['ALL', 'FINISHED', 'SCHEDULED'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95
                ${statusFilter === s
                  ? `${darkMode ? 'bg-barca-gold/15 text-barca-gold border border-barca-gold/25' : 'bg-barca-gold/20 text-barca-gold-dark border border-barca-gold/30'}`
                  : 'filter-inactive'
                }`}>
              {s === 'ALL' ? 'All Status' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Sort + Search */}
        <div className="flex gap-2 lg:ml-auto">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field sm:w-52"
            />
            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {search && (
              <button onClick={() => setSearch('')} className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-barca-away-text-muted hover:text-barca-away-text'}`}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Match grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
        {paginatedMatches.map((match) => <MatchCard key={match.id} match={match} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-barca-dark-card' : 'bg-barca-away-surface'}`}>
            <svg className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-barca-away-border'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>No matches found</p>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted/70'}`}>Try adjusting your filters</p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default Matches
