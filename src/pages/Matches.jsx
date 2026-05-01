import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMatches } from '../redux/matchesSlice'
import { useDebounce } from '../hooks'
import MatchCard from '../components/MatchCard'
import Pagination from '../components/Pagination'
import SkeletonCard from '../components/SkeletonCard'

const ITEMS_PER_PAGE = 6

function Matches() {
  const dispatch = useDispatch()
  const { items: matches, loading, error } = useSelector((s) => s.matches)
  const { darkMode } = useSelector((s) => s.ui)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortOrder, setSortOrder] = useState('newest')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (matches.length === 0) dispatch(fetchMatches())
  }, [dispatch, matches.length])

  // Reset page on filter change
  useEffect(() => { setPage(1) }, [debouncedSearch, statusFilter, sortOrder])

  // Filter + Sort + Search
  const filtered = useMemo(() => {
    let result = [...matches]

    // Status filter
    if (statusFilter === 'FINISHED') result = result.filter((m) => m.status === 'FINISHED')
    else if (statusFilter === 'SCHEDULED') result = result.filter((m) => m.status === 'SCHEDULED')

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter((m) =>
        m.homeTeam?.name?.toLowerCase().includes(q) ||
        m.awayTeam?.name?.toLowerCase().includes(q) ||
        m.competition?.name?.toLowerCase().includes(q)
      )
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.utcDate) - new Date(a.utcDate)
      return new Date(a.utcDate) - new Date(b.utcDate)
    })

    return result
  }, [matches, debouncedSearch, statusFilter, sortOrder])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const statusOptions = [
    { key: 'ALL', label: 'All Status' },
    { key: 'FINISHED', label: 'Finished' },
    { key: 'SCHEDULED', label: 'Scheduled' },
  ]

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title mb-1">Matches</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
            {filtered.length} matches found
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass-card p-4 mb-6 border-l-4 border-red-500">
          <p className="text-red-400 text-sm font-medium">⚠️ {error}</p>
          <button onClick={() => dispatch(fetchMatches())} className="text-xs text-barca-blue-light hover:underline mt-1">
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {statusOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setStatusFilter(opt.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95
              ${statusFilter === opt.key ? 'filter-active gradient-bg' : 'filter-inactive'}`}
          >
            {opt.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-3">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Match Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} variant="match" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {paginated.map((match) => <MatchCard key={match.id} match={match} />)}
          </div>
          {paginated.length === 0 && (
            <p className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>
              No matches found
            </p>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default Matches