import React, { useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearAllFavorites } from '../redux/favoritesSlice'
import MatchCard from '../components/MatchCard'
import PlayerCard from '../components/PlayerCard'

function Favorites() {
  const dispatch = useDispatch()
  const { matchIds, playerIds } = useSelector((s) => s.favorites)
  const { items: matches } = useSelector((s) => s.matches)
  const { items: players } = useSelector((s) => s.players)
  const { darkMode } = useSelector((s) => s.ui)

  const [tab, setTab] = useState('matches')
  const [showConfirm, setShowConfirm] = useState(false)

  const favoriteMatches = useMemo(
    () => matches.filter((m) => matchIds.includes(m.id)),
    [matches, matchIds]
  )

  const favoritePlayers = useMemo(
    () => players.filter((p) => playerIds.includes(p.id)),
    [players, playerIds]
  )

  const totalFavs = matchIds.length + playerIds.length

  const handleClearAll = () => {
    dispatch(clearAllFavorites())
    setShowConfirm(false)
  }

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title mb-1">Favorites</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
            {totalFavs} saved items
          </p>
        </div>
        {totalFavs > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="glass-card p-5 mb-6 border-l-4 border-red-500 animate-slide-down">
          <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>
            Remove all {totalFavs} favorites? This can't be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={handleClearAll}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-all active:scale-95">
              Yes, clear all
            </button>
            <button onClick={() => setShowConfirm(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${darkMode ? 'bg-barca-dark-card text-gray-300' : 'bg-barca-away-surface text-barca-away-text'}`}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('matches')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95
            ${tab === 'matches' ? 'filter-active gradient-bg' : 'filter-inactive'}`}
        >
          Matches ({matchIds.length})
        </button>
        <button
          onClick={() => setTab('players')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95
            ${tab === 'players' ? 'filter-active gradient-bg' : 'filter-inactive'}`}
        >
          Players ({playerIds.length})
        </button>
      </div>

      {/* Content */}
      {tab === 'matches' && (
        <>
          {favoriteMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {favoriteMatches.map((match) => <MatchCard key={match.id} match={match} />)}
            </div>
          ) : (
            <EmptyState darkMode={darkMode} type="matches" />
          )}
        </>
      )}

      {tab === 'players' && (
        <>
          {favoritePlayers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
              {favoritePlayers.map((player) => <PlayerCard key={player.id} player={player} />)}
            </div>
          ) : (
            <EmptyState darkMode={darkMode} type="players" />
          )}
        </>
      )}
    </div>
  )
}

function EmptyState({ darkMode, type }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <span className="text-5xl mb-4">{type === 'matches' ? '📋' : '👤'}</span>
      <p className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>
        No favorite {type} yet
      </p>
      <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
        Tap the ♥ icon on any {type === 'matches' ? 'match' : 'player'} card to save it here
      </p>
    </div>
  )
}

export default Favorites
