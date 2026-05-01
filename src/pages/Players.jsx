import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPlayers } from '../redux/playersSlice'
import { useDebounce } from '../hooks'
import PlayerCard from '../components/PlayerCard'
import Pagination from '../components/Pagination'
import SkeletonCard from '../components/SkeletonCard'

const POSITIONS = ['All', 'Goalkeeper', 'Defence', 'Midfield', 'Offence']
const ITEMS_PER_PAGE = 8

function Players() {
  const dispatch = useDispatch()
  const { items: players, loading } = useSelector((s) => s.players)
  const { darkMode } = useSelector((s) => s.ui)
  const [posFilter, setPosFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (players.length === 0) dispatch(fetchPlayers())
  }, [dispatch, players.length])

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1)
  }, [posFilter, debouncedSearch, sortBy])

  // Filtered, sorted players (memoized)
  const filtered = useMemo(() => {
    let result = posFilter === 'All' ? players : players.filter((p) => p.position === posFilter)

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) || (p.nationality || '').toLowerCase().includes(q)
      )
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'goals': return (b.stats?.goals || 0) - (a.stats?.goals || 0)
        case 'appearances': return (b.stats?.appearances || 0) - (a.stats?.appearances || 0)
        case 'assists': return (b.stats?.assists || 0) - (a.stats?.assists || 0)
        case 'number': return (a.shirtNumber || 99) - (b.shirtNumber || 99)
        default: return a.name.localeCompare(b.name)
      }
    })

    return result
  }, [players, posFilter, debouncedSearch, sortBy])

  const paginatedPlayers = useMemo(() => {
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
        <h1 className="page-title">Squad</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <SkeletonCard key={i} variant="player" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h1 className="page-title mb-1">Squad</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
            {filtered.length} player{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {POSITIONS.map((pos) => (
            <button key={pos} onClick={() => setPosFilter(pos)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95
                ${posFilter === pos ? 'gradient-bg filter-active' : 'filter-inactive'}`}>
              {pos === 'Offence' ? 'Forward' : pos}
            </button>
          ))}
        </div>

        <div className="flex gap-2 lg:ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="number">Shirt Number</option>
            <option value="goals">Most Goals</option>
            <option value="assists">Most Assists</option>
            <option value="appearances">Most Apps</option>
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search players..."
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

      {/* Player grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
        {paginatedPlayers.map((player) => <PlayerCard key={player.id} player={player} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-barca-dark-card' : 'bg-barca-away-surface'}`}>
            <svg className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-barca-away-border'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>No players found</p>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default Players
