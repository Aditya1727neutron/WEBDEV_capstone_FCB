import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPlayers } from '../redux/playersSlice'
import { useDebounce } from '../hooks'
import PlayerCard from '../components/PlayerCard'
import Pagination from '../components/Pagination'
import SkeletonCard from '../components/SkeletonCard'

const ITEMS_PER_PAGE = 8

function Players() {
  const dispatch = useDispatch()
  const { items: players, loading, error } = useSelector((s) => s.players)
  const { darkMode } = useSelector((s) => s.ui)

  const [search, setSearch] = useState('')
  const [posFilter, setPosFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('name')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (players.length === 0) dispatch(fetchPlayers())
  }, [dispatch, players.length])

  useEffect(() => { setPage(1) }, [debouncedSearch, posFilter, sortBy])

  const filtered = useMemo(() => {
    let result = [...players]

    // Position filter
    if (posFilter !== 'ALL') {
      result = result.filter((p) => p.position === posFilter)
    }

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(q) ||
        p.nationality?.toLowerCase().includes(q)
      )
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name': return (a.name || '').localeCompare(b.name || '')
        case 'goals': return (b.stats?.goals || 0) - (a.stats?.goals || 0)
        case 'assists': return (b.stats?.assists || 0) - (a.stats?.assists || 0)
        case 'appearances': return (b.stats?.appearances || 0) - (a.stats?.appearances || 0)
        case 'age': return (a.age || 99) - (b.age || 99)
        default: return 0
      }
    })

    return result
  }, [players, debouncedSearch, posFilter, sortBy])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const positions = [
    { key: 'ALL', label: 'All' },
    { key: 'Goalkeeper', label: 'GK' },
    { key: 'Defence', label: 'DEF' },
    { key: 'Midfield', label: 'MID' },
    { key: 'Offence', label: 'FWD' },
  ]

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title mb-1">Players</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
            {filtered.length} players
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass-card p-4 mb-6 border-l-4 border-red-500">
          <p className="text-red-400 text-sm font-medium">⚠️ {error}</p>
          <button onClick={() => dispatch(fetchPlayers())} className="text-xs text-barca-blue-light hover:underline mt-1">
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {positions.map((pos) => (
          <button
            key={pos.key}
            onClick={() => setPosFilter(pos.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95
              ${posFilter === pos.key ? 'filter-active gradient-bg' : 'filter-inactive'}`}
          >
            {pos.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-3">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="name">By Name</option>
            <option value="goals">Top Scorers</option>
            <option value="assists">Top Assists</option>
            <option value="appearances">Most Apps</option>
            <option value="age">Youngest</option>
          </select>

          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search players..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Player Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <SkeletonCard key={i} variant="player" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {paginated.map((player) => <PlayerCard key={player.id} player={player} />)}
          </div>
          {paginated.length === 0 && (
            <p className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>
              No players found
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

export default Players
