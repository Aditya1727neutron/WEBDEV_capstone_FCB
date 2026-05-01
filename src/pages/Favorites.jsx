import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMatches } from '../redux/matchesSlice'
import { fetchPlayers } from '../redux/playersSlice'
import { clearAllFavorites } from '../redux/favoritesSlice'
import MatchCard from '../components/MatchCard'
import PlayerCard from '../components/PlayerCard'
import Loader from '../components/Loader'

function Favorites() {
  const dispatch = useDispatch()
  const { items: matches, loading: mLoading } = useSelector(s => s.matches)
  const { items: players, loading: pLoading } = useSelector(s => s.players)
  const { matchIds, playerIds } = useSelector(s => s.favorites)
  const { darkMode } = useSelector(s => s.ui)
  const [tab, setTab] = useState('matches')

  useEffect(() => {
    if (matches.length === 0) dispatch(fetchMatches())
    if (players.length === 0) dispatch(fetchPlayers())
  }, [dispatch, matches.length, players.length])

  if (mLoading || pLoading) return <Loader />

  const favMatches = matches.filter(m => matchIds.includes(m.id))
  const favPlayers = players.filter(p => playerIds.includes(p.id))
  const total = matchIds.length + playerIds.length

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Favorites</h1>
        {total > 0 && (
          <button onClick={() => dispatch(clearAllFavorites())} className="text-xs text-barca-red hover:text-barca-red-light font-semibold transition-colors">Clear All</button>
        )}
      </div>
      <div className="flex gap-2 mb-6">
        {['matches', 'players'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'gradient-bg filter-active' : 'filter-inactive'}`}>
            {t === 'matches' ? `Matches (${matchIds.length})` : `Players (${playerIds.length})`}
          </button>
        ))}
      </div>
      {tab === 'matches' ? (
        favMatches.length > 0
          ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{favMatches.map(m => <MatchCard key={m.id} match={m} />)}</div>
          : <Empty dm={darkMode} msg="No favorite matches yet" sub="Click the heart on any match" />
      ) : (
        favPlayers.length > 0
          ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{favPlayers.map(p => <PlayerCard key={p.id} player={p} />)}</div>
          : <Empty dm={darkMode} msg="No favorite players yet" sub="Click the heart on any player" />
      )}
    </div>
  )
}

function Empty({ msg, sub, dm }) {
  return (
    <div className="text-center py-20">
      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${dm ? 'bg-barca-dark-card' : 'bg-barca-away-surface'}`}>
        <svg className={`w-8 h-8 ${dm ? 'text-gray-600' : 'text-barca-away-border'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <p className={`text-lg font-medium ${dm ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>{msg}</p>
      <p className={`text-sm mt-1 ${dm ? 'text-gray-500' : 'text-barca-away-text-muted/70'}`}>{sub}</p>
    </div>
  )
}

export default Favorites
