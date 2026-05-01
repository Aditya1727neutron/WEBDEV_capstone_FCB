import React, { useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchMatches } from '../redux/matchesSlice'
import { toggleFavoriteMatch } from '../redux/favoritesSlice'
import { useIsMatchFavorite } from '../hooks'
import { formatMatchDate, formatMatchTime, getMatchResult, getResultBadgeClass, isBarcaHome, getBarcaScore, getOpponentScore } from '../utils/matchUtils'
import Loader from '../components/Loader'

function MatchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items: matches, loading } = useSelector((s) => s.matches)
  const { darkMode } = useSelector((s) => s.ui)
  const matchId = parseInt(id, 10)
  const isFavorite = useIsMatchFavorite(matchId)

  useEffect(() => {
    if (matches.length === 0) dispatch(fetchMatches())
  }, [dispatch, matches.length])

  const match = useMemo(() => matches.find((m) => m.id === matchId), [matches, matchId])

  const handleFavorite = useCallback(() => dispatch(toggleFavoriteMatch(matchId)), [dispatch, matchId])
  const handleBack = useCallback(() => navigate(-1), [navigate])
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: 'FC Barcelona Match', url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }, [])

  if (loading) return <Loader />
  if (!match) {
    return (
      <div className="page-container text-center py-20">
        <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-barca-dark-card' : 'bg-barca-away-surface'}`}>
          <svg className={`w-10 h-10 ${darkMode ? 'text-gray-600' : 'text-barca-away-border'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className={`text-xl font-medium mb-4 ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>Match not found</p>
        <button onClick={() => navigate('/matches')} className="btn-primary">Back to Matches</button>
      </div>
    )
  }

  const result = getMatchResult(match)
  const isHome = isBarcaHome(match)
  const isFinished = match.status === 'FINISHED'
  const barcaGoals = isFinished ? getBarcaScore(match) : null
  const oppGoals = isFinished ? getOpponentScore(match) : null

  return (
    <div className="page-container max-w-3xl">
      {/* Back button */}
      <button onClick={handleBack} className={`flex items-center gap-2 text-sm font-medium mb-6 transition-colors active:scale-95 ${darkMode ? 'text-gray-400 hover:text-barca-blue-light' : 'text-barca-away-text-muted hover:text-barca-red'}`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>

      {/* Match card */}
      <div className={`glass-card p-6 md:p-8 relative overflow-hidden ${result === 'WIN' ? 'result-glow-win' : result === 'LOSS' ? 'result-glow-loss' : result === 'DRAW' ? 'result-glow-draw' : ''}`}>
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 gradient-bg" />

        {/* Competition, actions */}
        <div className="flex items-center justify-between mb-6">
          <span className={`text-sm font-semibold px-3 py-1.5 rounded-lg ${darkMode ? 'text-barca-blue-light bg-barca-blue/15 border border-barca-blue/20' : 'text-barca-red bg-barca-red/10 border border-barca-red/15'}`}>
            {match.competition?.name}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className={`p-2 rounded-xl transition-colors active:scale-90 ${darkMode ? 'hover:bg-barca-dark-card text-gray-400' : 'hover:bg-barca-away-surface text-barca-away-text-muted'}`} title="Share">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button onClick={handleFavorite} className={`p-2 rounded-xl transition-all duration-200 active:scale-90 ${darkMode ? 'hover:bg-barca-dark-card' : 'hover:bg-barca-away-surface'}`}>
              <svg className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'text-barca-red fill-current' : darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`} fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Teams & Score */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <TeamBlock team={match.homeTeam} isBarça={isHome} label="HOME" darkMode={darkMode} />
          <div className="text-center px-4">
            {isFinished ? (
              <>
                <div className="flex items-center gap-4">
                  <span className={`text-4xl md:text-5xl font-bold font-heading ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{match.score?.fullTime?.home}</span>
                  <span className={`text-2xl font-light ${darkMode ? 'text-gray-600' : 'text-barca-away-border'}`}>–</span>
                  <span className={`text-4xl md:text-5xl font-bold font-heading ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{match.score?.fullTime?.away}</span>
                </div>
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>HT: {match.score?.halfTime?.home} – {match.score?.halfTime?.away}</p>
                {result && <span className={`mt-3 inline-block text-xs font-bold px-4 py-1.5 rounded-full border ${getResultBadgeClass(result)}`}>{result}</span>}
              </>
            ) : (
              <div className="text-center">
                <p className={`text-lg font-bold ${darkMode ? 'text-barca-blue-light' : 'text-barca-red'}`}>VS</p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>{formatMatchTime(match.utcDate)}</p>
              </div>
            )}
          </div>
          <TeamBlock team={match.awayTeam} isBarça={!isHome} label="AWAY" darkMode={darkMode} />
        </div>

        {/* Match stats (for finished matches) */}
        {isFinished && (
          <div className={`grid grid-cols-3 gap-4 py-4 mb-4 rounded-xl ${darkMode ? 'bg-barca-dark-surface/50' : 'bg-barca-away-surface/50'}`}>
            <div className="text-center">
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{barcaGoals}</p>
              <p className={`text-[10px] uppercase tracking-wider font-semibold ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>Barça Goals</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{oppGoals}</p>
              <p className={`text-[10px] uppercase tracking-wider font-semibold ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>Opponent</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{barcaGoals - oppGoals > 0 ? '+' : ''}{barcaGoals - oppGoals}</p>
              <p className={`text-[10px] uppercase tracking-wider font-semibold ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>Goal Diff</p>
            </div>
          </div>
        )}

        {/* Date & Status */}
        <div className={`border-t pt-4 ${darkMode ? 'border-barca-dark-border/50' : 'border-barca-away-border/50'}`}>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className={`flex items-center gap-1.5 text-sm ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {formatMatchDate(match.utcDate)}
            </span>
            <span className={`flex items-center gap-1.5 text-sm ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {formatMatchTime(match.utcDate)}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${match.status === 'FINISHED' ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'}`}>
              {match.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TeamBlock({ team, isBarça, label, darkMode }) {
  return (
    <div className="flex-1 text-center">
      <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-105
        ${isBarça
          ? 'gradient-bg shadow-xl'
          : darkMode ? 'bg-barca-dark-surface border border-barca-dark-border' : 'bg-barca-away-surface border border-barca-away-border'
        }`}>
        <span className={`text-sm font-bold ${isBarça ? 'text-white' : darkMode ? 'text-gray-300' : 'text-barca-away-text'}`}>
          {(team?.shortName || team?.name || '???').substring(0, 3).toUpperCase()}
        </span>
      </div>
      <p className={`text-sm font-bold ${isBarça ? 'gradient-text' : darkMode ? 'text-gray-300' : 'text-barca-away-text'}`}>{team?.name}</p>
      <span className={`text-[10px] font-bold tracking-wider ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>{label}</span>
    </div>
  )
}

export default MatchDetail
