import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavoriteMatch } from '../redux/favoritesSlice'
import { useIsMatchFavorite } from '../hooks'
import { formatMatchDate, formatMatchTime, getMatchResult, getResultBadgeClass, isBarcaHome } from '../utils/matchUtils'

function MatchCard({ match }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { darkMode } = useSelector(s => s.ui)
  const isFavorite = useIsMatchFavorite(match.id)
  const result = getMatchResult(match)
  const isHome = isBarcaHome(match)
  const isFinished = match.status === 'FINISHED'

  return (
    <div
      onClick={() => navigate(`/match/${match.id}`)}
      className="glass-card-hover p-5 cursor-pointer group relative overflow-hidden"
    >
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-bg opacity-60 group-hover:opacity-100 transition-opacity"></div>

      {/* Top row — Competition & Favorite */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg
          ${darkMode
            ? 'text-barca-blue-light bg-barca-blue/20'
            : 'text-barca-red bg-barca-red/10'
          }`}>
          {match.competition?.name || 'Competition'}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); dispatch(toggleFavoriteMatch(match.id)) }}
          className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-barca-dark-card' : 'hover:bg-barca-away-surface'}`}
        >
          <svg className={`w-4 h-4 transition-all duration-300 ${isFavorite ? 'text-barca-red fill-current scale-110' : darkMode ? 'text-gray-400 hover:text-barca-red' : 'text-barca-away-text-muted hover:text-barca-red'}`}
            fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Match teams & score */}
      <div className="flex items-center justify-between gap-3">
        {/* Home team */}
        <div className={`flex-1 text-center ${isHome ? '' : 'opacity-80'}`}>
          <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center
            ${darkMode ? 'bg-barca-dark-surface' : 'bg-barca-away-surface'}`}>
            <span className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-barca-away-text'}`}>
              {(match.homeTeam?.shortName || match.homeTeam?.name || 'HOM').substring(0, 3).toUpperCase()}
            </span>
          </div>
          <p className={`text-sm font-semibold truncate ${isHome ? (darkMode ? 'text-barca-blue-light' : 'text-barca-red') : (darkMode ? 'text-gray-300' : 'text-barca-away-text')}`}>
            {match.homeTeam?.shortName || match.homeTeam?.name || 'Home'}
          </p>
          {isHome && <span className={`text-[10px] font-bold ${darkMode ? 'text-barca-gold' : 'text-barca-gold-dark'}`}>HOME</span>}
        </div>

        {/* Score */}
        <div className="flex flex-col items-center px-4">
          {isFinished ? (
            <>
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{match.score?.fullTime?.home ?? '-'}</span>
                <span className="text-lg text-gray-400">:</span>
                <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{match.score?.fullTime?.away ?? '-'}</span>
              </div>
              {result && (
                <span className={`mt-2 text-xs font-bold px-2.5 py-0.5 rounded-full border ${getResultBadgeClass(result)}`}>
                  {result}
                </span>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center">
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>
                {formatMatchTime(match.utcDate)}
              </span>
              <span className={`text-xs font-semibold mt-1 ${darkMode ? 'text-barca-blue-light' : 'text-barca-red'}`}>
                UPCOMING
              </span>
            </div>
          )}
        </div>

        {/* Away team */}
        <div className={`flex-1 text-center ${!isHome ? '' : 'opacity-80'}`}>
          <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center
            ${darkMode ? 'bg-barca-dark-surface' : 'bg-barca-away-surface'}`}>
            <span className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-barca-away-text'}`}>
              {(match.awayTeam?.shortName || match.awayTeam?.name || 'AWY').substring(0, 3).toUpperCase()}
            </span>
          </div>
          <p className={`text-sm font-semibold truncate ${!isHome ? (darkMode ? 'text-barca-blue-light' : 'text-barca-red') : (darkMode ? 'text-gray-300' : 'text-barca-away-text')}`}>
            {match.awayTeam?.shortName || match.awayTeam?.name || 'Away'}
          </p>
          {!isHome && <span className={`text-[10px] font-bold ${darkMode ? 'text-barca-gold' : 'text-barca-gold-dark'}`}>AWAY</span>}
        </div>
      </div>

      {/* Bottom — Date */}
      <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-barca-dark-border' : 'border-barca-away-border'}`}>
        <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>
          {formatMatchDate(match.utcDate)}
        </p>
      </div>
    </div>
  )
}

export default MatchCard
