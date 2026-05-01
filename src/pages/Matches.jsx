import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMatches } from '../redux/matchesSlice'
import { filterByCompetition, sortByDateDesc } from '../utils/matchUtils'
import MatchCard from '../components/MatchCard'
import Loader from '../components/Loader'

const FILTERS = [
  { code: 'ALL', label: 'All' },
  { code: 'PD', label: 'La Liga' },
  { code: 'CL', label: 'Champions League' },
]

function Matches() {
  const dispatch = useDispatch()
  const { items: matches, loading } = useSelector(s => s.matches)
  const { darkMode } = useSelector(s => s.ui)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    if (matches.length === 0) dispatch(fetchMatches())
  }, [dispatch, matches.length])

  if (loading) return <Loader />

  let filtered = filterByCompetition(matches, filter)
  if (statusFilter === 'FINISHED') filtered = filtered.filter(m => m.status === 'FINISHED')
  else if (statusFilter === 'SCHEDULED') filtered = filtered.filter(m => m.status === 'SCHEDULED')
  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(m =>
      (m.homeTeam?.name || '').toLowerCase().includes(q) ||
      (m.awayTeam?.name || '').toLowerCase().includes(q) ||
      (m.competition?.name || '').toLowerCase().includes(q)
    )
  }
  filtered = sortByDateDesc(filtered)

  return (
    <div className="page-container">
      <h1 className="page-title">Matches</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f.code} onClick={() => setFilter(f.code)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                ${filter === f.code ? 'gradient-bg filter-active' : 'filter-inactive'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['ALL', 'FINISHED', 'SCHEDULED'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all
                ${statusFilter === s ? 'bg-barca-gold/20 text-barca-gold-dark dark:text-barca-gold border border-barca-gold/30' : 'filter-inactive'}`}>
              {s === 'ALL' ? 'All Status' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto relative">
          <input type="text" placeholder="Search teams..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-field sm:w-56" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>{filtered.length} match{filtered.length !== 1 ? 'es' : ''}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(match => <MatchCard key={match.id} match={match} />)}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>No matches found</p>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted/70'}`}>Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}

export default Matches
