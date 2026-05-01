import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPlayers } from '../redux/playersSlice'
import PlayerCard from '../components/PlayerCard'
import Loader from '../components/Loader'

const POSITIONS = ['All', 'Goalkeeper', 'Defence', 'Midfield', 'Offence']

function Players() {
  const dispatch = useDispatch()
  const { items: players, loading } = useSelector(s => s.players)
  const { darkMode } = useSelector(s => s.ui)
  const [posFilter, setPosFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (players.length === 0) dispatch(fetchPlayers())
  }, [dispatch, players.length])

  if (loading) return <Loader />

  let filtered = posFilter === 'All' ? players : players.filter(p => p.position === posFilter)
  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || (p.nationality || '').toLowerCase().includes(q))
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Squad</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {POSITIONS.map(pos => (
            <button key={pos} onClick={() => setPosFilter(pos)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                ${posFilter === pos ? 'gradient-bg filter-active' : 'filter-inactive'}`}>
              {pos === 'Offence' ? 'Forward' : pos}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto relative">
          <input type="text" placeholder="Search players..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-field sm:w-56" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>{filtered.length} player{filtered.length !== 1 ? 's' : ''}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(player => <PlayerCard key={player.id} player={player} />)}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>No players found</p>
        </div>
      )}
    </div>
  )
}

export default Players
