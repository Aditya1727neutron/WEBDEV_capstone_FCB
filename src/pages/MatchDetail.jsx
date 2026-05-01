import React, { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchMatches } from '../redux/matchesSlice'
import { toggleFavoriteMatch } from '../redux/favoritesSlice'
import { useIsMatchFavorite } from '../hooks'
import { formatMatchDate, formatMatchTime, getMatchResult, getResultBadgeClass, isBarcaHome } from '../utils/matchUtils'
import Loader from '../components/Loader'

function MatchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items: matches, loading } = useSelector(s => s.matches)
  const matchId = parseInt(id, 10)
  const isFavorite = useIsMatchFavorite(matchId)

  useEffect(() => {
    if (matches.length === 0) dispatch(fetchMatches())
  }, [dispatch, matches.length])

  const match = useMemo(() => matches.find(m => m.id === matchId), [matches, matchId])

  if (loading) return <Loader />
  if (!match) {
    return (
      <div className="page-container text-center py-20">
        <p className="text-xl text-gray-400 mb-4">Match not found</p>
        <button onClick={() => navigate('/matches')} className="btn-primary">Back to Matches</button>
      </div>
    )
  }

  const result = getMatchResult(match)
  const isHome = isBarcaHome(match)
  const isFinished = match.status === 'FINISHED'

  return (
    <div className="page-container max-w-3xl">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-barca-blue dark:hover:text-barca-blue-light mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>

      {/* Match card */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 gradient-bg"></div>

        {/* Competition & actions */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-semibold text-barca-blue dark:text-barca-blue-light bg-barca-blue/10 dark:bg-barca-blue/20 px-3 py-1.5 rounded-lg">
            {match.competition?.name}
          </span>
          <button onClick={() => dispatch(toggleFavoriteMatch(matchId))} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-barca-dark-card transition-colors">
            <svg className={`w-5 h-5 ${isFavorite ? 'text-barca-red fill-current' : 'text-gray-400'}`} fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Teams & Score */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <TeamBlock team={match.homeTeam} isBarça={isHome} label="HOME" />
          <div className="text-center px-6">
            {isFinished ? (
              <>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{match.score?.fullTime?.home}</span>
                  <span className="text-2xl text-gray-400">–</span>
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{match.score?.fullTime?.away}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">HT: {match.score?.halfTime?.home} – {match.score?.halfTime?.away}</p>
                {result && <span className={`mt-2 inline-block text-xs font-bold px-3 py-1 rounded-full border ${getResultBadgeClass(result)}`}>{result}</span>}
              </>
            ) : (
              <div className="text-center">
                <p className="text-sm font-medium text-barca-blue dark:text-barca-blue-light">VS</p>
                <p className="text-xs text-gray-500 mt-1">{formatMatchTime(match.utcDate)}</p>
              </div>
            )}
          </div>
          <TeamBlock team={match.awayTeam} isBarça={!isHome} label="AWAY" />
        </div>

        {/* Date */}
        <div className="border-t border-gray-100 dark:border-barca-dark-border pt-4">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>📅 {formatMatchDate(match.utcDate)}</span>
            <span>⏰ {formatMatchTime(match.utcDate)}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${match.status === 'FINISHED' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>{match.status}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TeamBlock({ team, isBarça, label }) {
  return (
    <div className="flex-1 text-center">
      <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center ${isBarça ? 'gradient-bg shadow-lg shadow-barca-blue/30' : 'bg-gray-100 dark:bg-barca-dark-card'}`}>
        <span className={`text-sm font-bold ${isBarça ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
          {(team?.shortName || team?.name || '???').substring(0, 3).toUpperCase()}
        </span>
      </div>
      <p className={`text-sm font-bold ${isBarça ? 'gradient-text' : 'text-gray-700 dark:text-gray-300'}`}>{team?.name}</p>
      <span className="text-[10px] text-gray-400 font-semibold">{label}</span>
    </div>
  )
}

export default MatchDetail
