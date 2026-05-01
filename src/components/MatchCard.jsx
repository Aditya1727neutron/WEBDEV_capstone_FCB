import React, { useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavoriteMatch } from '../redux/favoritesSlice'
import { useIsMatchFavorite } from '../hooks'
import { formatMatchDate, formatMatchTime, getMatchResult, getResultBadgeClass, isBarcaHome } from '../utils/matchUtils'

function MatchCard({ match }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { darkMode } = useSelector((s) => s.ui)
  const isFavorite = useIsMatchFavorite(match.id)
  const result = useMemo(() => getMatchResult(match), [match])
  const isHome = useMemo(() => isBarcaHome(match), [match])
  const isFinished = match.status === 'FINISHED'

  const handleClick = useCallback(() => navigate(`/match/${match.id}`), [navigate, match.id])
  const handleFavorite = useCallback((e) => {
    e.stopPropagation()
    dispatch(toggleFavoriteMatch(match.id))
  }, [dispatch, match.id])

  // Relative time for finished matches
  const relativeTime = useMemo(() => {
    if (!match.utcDate) return ''
    const diff = Date.now() - new Date(match.utcDate).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    return formatMatchDate(match.utcDate)
  }, [match.utcDate])

  // Result glow class
  const glowClass = result === 'WIN' ? 'result-glow-win' : result === 'LOSS' ? 'result-glow-loss' : result === 'DRAW' ? 'result-glow-draw' : ''

  return (
    <div
      onClick={handleClick}
      className={`glass-card-hover p-5 group relative overflow-hidden ${glowClass}`}
    >
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top row — Competition & Favorite */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg
          ${darkMode
            ? 'text-barca-blue-light bg-barca-blue/15 border border-barca-blue/20'
            : 'text-barca-red bg-barca-red/10 border border-barca-red/15'
          }`}>
          {match.competition?.name || 'Competition'}
        </span>
        <button
          onClick={handleFavorite}
          className={`p-1.5 rounded-lg transition-all duration-200 active:scale-90
            ${darkMode ? 'hover:bg-barca-dark-card' : 'hover:bg-barca-away-surface'}`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg className={`w-4 h-4 transition-all duration-300 ${isFavorite ? 'text-barca-red fill-current scale-110' : darkMode ? 'text-gray-500 hover:text-barca-red' : 'text-barca-away-text-muted hover:text-barca-red'}`}
            fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Match teams & score */}
      <div className="flex items-center justify-between gap-2">
        {/* Home team */}
        <div className={`flex-1 text-center ${isHome ? '' : 'opacity-75'}`}>
          <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105
            ${isHome
              ? 'gradient-bg shadow-lg'
              : darkMode ? 'bg-barca-dark-surface border border-barca-dark-border' : 'bg-barca-away-surface border border-barca-away-border'
            }`}>
            <span className={`text-xs font-bold ${isHome ? 'text-white' : darkMode ? 'text-gray-300' : 'text-barca-away-text'}`}>
              {(match.homeTeam?.shortName || match.homeTeam?.name || 'HOM').substring(0, 3).toUpperCase()}
            </span>
          </div>
          <p className={`text-xs font-semibold truncate ${isHome ? (darkMode ? 'text-barca-blue-light' : 'text-barca-red') : (darkMode ? 'text-gray-300' : 'text-barca-away-text')}`}>
            {match.homeTeam?.shortName || match.homeTeam?.name || 'Home'}
          </p>
          {isHome && <span className={`text-[9px] font-bold tracking-wider ${darkMode ? 'text-barca-gold' : 'text-barca-gold-dark'}`}>BARÇA</span>}
        </div>

        {/* Score */}
        <div className="flex flex-col items-center px-3">
          {isFinished ? (
            <>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold font-heading ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{match.score?.fullTime?.home ?? '-'}</span>
                <span className="text-sm text-gray-400 font-light">–</span>
                <span className={`text-2xl font-bold font-heading ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{match.score?.fullTime?.away ?? '-'}</span>
              </div>
              {result && (
                <span className={`mt-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getResultBadgeClass(result)}`}>
                  {result}
                </span>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center">
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>
                {formatMatchTime(match.utcDate)}
              </span>
              <span className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${darkMode ? 'text-barca-blue-light bg-barca-blue/15' : 'text-barca-red bg-barca-red/10'}`}>
                UPCOMING
              </span>
            </div>
          )}
        </div>

        {/* Away team */}
        <div className={`flex-1 text-center ${!isHome ? '' : 'opacity-75'}`}>
          <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105
            ${!isHome
              ? 'gradient-bg shadow-lg'
              : darkMode ? 'bg-barca-dark-surface border border-barca-dark-border' : 'bg-barca-away-surface border border-barca-away-border'
            }`}>
            <span className={`text-xs font-bold ${!isHome ? 'text-white' : darkMode ? 'text-gray-300' : 'text-barca-away-text'}`}>
              {(match.awayTeam?.shortName || match.awayTeam?.name || 'AWY').substring(0, 3).toUpperCase()}
            </span>
          </div>
          <p className={`text-xs font-semibold truncate ${!isHome ? (darkMode ? 'text-barca-blue-light' : 'text-barca-red') : (darkMode ? 'text-gray-300' : 'text-barca-away-text')}`}>
            {match.awayTeam?.shortName || match.awayTeam?.name || 'Away'}
          </p>
          {!isHome && <span className={`text-[9px] font-bold tracking-wider ${darkMode ? 'text-barca-gold' : 'text-barca-gold-dark'}`}>BARÇA</span>}
        </div>
      </div>

      {/* Bottom — Date */}
      <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-barca-dark-border/50' : 'border-barca-away-border/50'}`}>
        <p className={`text-[11px] text-center font-medium ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
          {isFinished ? relativeTime : formatMatchDate(match.utcDate)}
        </p>
      </div>
    </div>
  )
}

export default React.memo(MatchCard)
