import React, { useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavoritePlayer } from '../redux/favoritesSlice'
import { useIsPlayerFavorite } from '../hooks'
import { formatPosition, getPositionColor } from '../utils/matchUtils'

function PlayerCard({ player }) {
  const dispatch = useDispatch()
  const { darkMode } = useSelector((s) => s.ui)
  const isFavorite = useIsPlayerFavorite(player.id)

  const handleFavorite = useCallback((e) => {
    e.stopPropagation()
    dispatch(toggleFavoritePlayer(player.id))
  }, [dispatch, player.id])

  const age = useMemo(() => {
    if (!player.dateOfBirth) return null
    return new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear()
  }, [player.dateOfBirth])

  const initials = useMemo(() => {
    const parts = player.name.split(' ')
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : player.name.substring(0, 2).toUpperCase()
  }, [player.name])

  // Calculate stat bar widths (normalized to max for visual)
  const maxGoals = 30
  const maxAssists = 20
  const maxApps = 40

  return (
    <div className="glass-card-hover p-5 group relative overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header: Avatar + Position + Favorite */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Player avatar with initials */}
          <div className="relative">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-sm font-heading">{player.shirtNumber || initials}</span>
            </div>
            {/* Position dot */}
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border-2 ${darkMode ? 'border-barca-dark-card' : 'border-white'} ${getPositionColor(player.position).replace('border-', 'bg-').replace('/20', '').replace('text-', 'text-')}`}>
              {formatPosition(player.position)}
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getPositionColor(player.position)}`}>
            {formatPosition(player.position)}
          </span>
        </div>
        <button
          onClick={handleFavorite}
          className={`p-1.5 rounded-lg transition-all duration-200 active:scale-90 ${darkMode ? 'hover:bg-barca-dark-card' : 'hover:bg-barca-away-surface'}`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg className={`w-4 h-4 transition-all duration-300 ${isFavorite ? 'text-barca-red fill-current scale-110' : darkMode ? 'text-gray-500 hover:text-barca-red' : 'text-barca-away-text-muted hover:text-barca-red'}`}
            fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Name & info */}
      <h3 className={`text-base font-bold mb-1 font-heading ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>
        {player.name}
      </h3>
      <div className={`flex items-center gap-2 text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>
        <span>{player.nationality}</span>
        {age && (
          <>
            <span className={darkMode ? 'text-gray-600' : 'text-barca-away-border'}>•</span>
            <span>{age} yrs</span>
          </>
        )}
        {player.shirtNumber && (
          <>
            <span className={darkMode ? 'text-gray-600' : 'text-barca-away-border'}>•</span>
            <span>#{player.shirtNumber}</span>
          </>
        )}
      </div>

      {/* Stats with visual bars */}
      {player.stats && (
        <div className={`pt-3 border-t ${darkMode ? 'border-barca-dark-border/50' : 'border-barca-away-border/50'}`}>
          {/* Stat row: Appearances */}
          <div className="mb-2.5">
            <div className="flex justify-between items-center mb-1">
              <span className={`text-[10px] uppercase tracking-wider font-semibold ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>Apps</span>
              <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{player.stats.appearances}</span>
            </div>
            <div className="stat-bar">
              <div className="stat-bar-fill bg-barca-blue" style={{ width: `${Math.min((player.stats.appearances / maxApps) * 100, 100)}%` }} />
            </div>
          </div>

          {/* Stat row: Goals or Clean Sheets */}
          <div className="mb-2.5">
            <div className="flex justify-between items-center mb-1">
              <span className={`text-[10px] uppercase tracking-wider font-semibold ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
                {player.position === 'Goalkeeper' ? 'Clean Sheets' : 'Goals'}
              </span>
              <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>
                {player.position === 'Goalkeeper' ? player.stats.cleanSheets : player.stats.goals}
              </span>
            </div>
            <div className="stat-bar">
              <div className="stat-bar-fill bg-barca-red" style={{ width: `${Math.min(((player.position === 'Goalkeeper' ? player.stats.cleanSheets : player.stats.goals) / maxGoals) * 100, 100)}%` }} />
            </div>
          </div>

          {/* Stat row: Assists */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className={`text-[10px] uppercase tracking-wider font-semibold ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>Assists</span>
              <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{player.stats.assists}</span>
            </div>
            <div className="stat-bar">
              <div className="stat-bar-fill bg-barca-gold" style={{ width: `${Math.min((player.stats.assists / maxAssists) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(PlayerCard)
