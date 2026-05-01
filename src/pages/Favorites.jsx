import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMatches } from '../redux/matchesSlice'
import { fetchPlayers } from '../redux/playersSlice'
import { clearAllFavorites } from '../redux/favoritesSlice'
import MatchCard from '../components/MatchCard'
import PlayerCard from '../components/PlayerCard'
import Loader from '../components/Loader'

function Favorites() {
  const dispatch = useDispatch()
  const { items: matches, loading: mLoading } = useSelector((s) => s.matches)
  const { items: players, loading: pLoading } = useSelector((s) => s.players)
  const { matchIds, playerIds } = useSelector((s) => s.favorites)
  const { darkMode } = useSelector((s) => s.ui)
  const [tab, setTab] = useState('matches')

  useEffect(() => {
    if (matches.length === 0) dispatch(fetchMatches())
    if (players.length === 0) dispatch(fetchPlayers())
  }, [dispatch, matches.length, players.length])

  const handleClear = useCallback(() => {
    if (window.confirm('Remove all favorites?')) {
      dispatch(clearAllFavorites())
    }
  }, [dispatch])

  const favMatches = useMemo(() => matches.filter((m) => matchIds.includes(m.id)), [matches, matchIds])
  const favPlayers = useMemo(() => players.filter((p) => playerIds.includes(p.id)), [players, playerIds])
  const total = matchIds.length + playerIds.length

  if (mLoading || pLoading) return <Loader />

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title mb-1">Favorites</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
            {total} saved item{total !== 1 ? 's' : ''}
          </p>
        </div>
        {total > 0 && (
          <button
            onClick={handleClear}
            className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 border
              ${darkMode
                ? 'text-red-400 border-red-500/20 hover:bg-red-500/10'
                : 'text-barca-red border-barca-red/20 hover:bg-barca-red/5'
              }`}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['matches', 'players'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95
              ${tab === t ? 'gradient-bg filter-active' : 'filter-inactive'}`}>
            {t === 'matches' ? `Matches (${matchIds.length})` : `Players (${playerIds.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {tab === 'matches' ? (
          favMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
              {favMatches.map((m) => <MatchCard key={m.id} match={m} />)}
            </div>
          ) : (
            <Empty darkMode={darkMode} msg="No favorite matches yet" sub="Click the heart icon on any match to save it" />
          )
        ) : (
          favPlayers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
              {favPlayers.map((p) => <PlayerCard key={p.id} player={p} />)}
            </div>
          ) : (
            <Empty darkMode={darkMode} msg="No favorite players yet" sub="Click the heart icon on any player to save them" />
          )
        )}
      </div>
    </div>
  )
}

function Empty({ msg, sub, darkMode }) {
  return (
    <div className="text-center py-20">
      <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-barca-dark-card border border-barca-dark-border' : 'bg-barca-away-surface border border-barca-away-border'}`}>
        <svg className={`w-10 h-10 ${darkMode ? 'text-gray-600' : 'text-barca-away-border'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <p className={`text-lg font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>{msg}</p>
      <p className={`text-sm ${darkMode ? 'text-gray-600' : 'text-barca-away-text-muted/70'}`}>{sub}</p>
    </div>
  )
}

export default Favorites
