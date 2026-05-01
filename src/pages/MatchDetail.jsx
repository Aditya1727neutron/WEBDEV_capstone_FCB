import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMatches } from '../redux/matchesSlice'
import { toggleFavoriteMatch } from '../redux/favoritesSlice'
import { useIsMatchFavorite } from '../hooks'
import { getMatchResult, getResultBadgeClass, formatMatchDate, formatMatchTime, isBarcaHome } from '../utils/matchUtils'
import Loader from '../components/Loader'

function MatchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items: matches, loading } = useSelector((s) => s.matches)
  const { darkMode } = useSelector((s) => s.ui)
  const matchId = parseInt(id)
  const isFavorite = useIsMatchFavorite(matchId)
  const [shareMsg, setShareMsg] = useState('')

  useEffect(() => {
    if (matches.length === 0) dispatch(fetchMatches())
  }, [dispatch, matches.length])

  const match = useMemo(() => matches.find((m) => m.id === matchId), [matches, matchId])
  const result = useMemo(() => match ? getMatchResult(match) : null, [match])
  const isHome = useMemo(() => match ? isBarcaHome(match) : false, [match])

  const handleFavorite = useCallback(() => {
    dispatch(toggleFavoriteMatch(matchId))
  }, [dispatch, matchId])

  const handleShare = useCallback(() => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setShareMsg('Link copied!')
      setTimeout(() => setShareMsg(''), 2000)
    })
  }, [])

  if (loading) return <Loader />

  if (!match) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[50vh]">
        <p className={`text-lg mb-4 ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>
          Match not found
        </p>
        <button onClick={() => navigate('/matches')} className="px-4 py-2 gradient-bg text-white rounded-xl text-sm font-bold">
          ← Back to Matches
        </button>
      </div>
    )
  }

  const glowClass = result === 'WIN' ? 'result-glow-win' : result === 'LOSS' ? 'result-glow-loss' : result === 'DRAW' ? 'result-glow-draw' : ''

  return (
    <div className="page-container max-w-3xl mx-auto">
      {/* Back + Actions */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95
            ${darkMode ? 'text-gray-300 hover:bg-barca-dark-card' : 'text-barca-away-text hover:bg-barca-away-surface'}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex items-center gap-2">
          <button onClick={handleShare}
            className={`p-2 rounded-xl transition-all active:scale-90 ${darkMode ? 'text-gray-400 hover:bg-barca-dark-card' : 'text-barca-away-text-muted hover:bg-barca-away-surface'}`}
            title="Share">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          {shareMsg && <span className="text-xs text-green-400 font-semibold">{shareMsg}</span>}
          <button onClick={handleFavorite}
            className={`p-2 rounded-xl transition-all active:scale-90 ${darkMode ? 'hover:bg-barca-dark-card' : 'hover:bg-barca-away-surface'}`}>
            <svg className={`w-5 h-5 transition-all ${isFavorite ? 'text-barca-red fill-current' : darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}
              fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Match Card */}
      <div className={`glass-card p-8 relative overflow-hidden ${glowClass}`}>
        <div className="absolute top-0 left-0 right-0 h-1 gradient-bg" />

        {/* Competition */}
        <div className="text-center mb-6">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg
            ${darkMode ? 'text-barca-blue-light bg-barca-blue/15 border border-barca-blue/20' : 'text-barca-red bg-barca-red/10 border border-barca-red/15'}`}>
            {match.competition?.name}
          </span>
        </div>

        {/* Teams & Score */}
        <div className="flex items-center justify-center gap-8 mb-6">
          {/* Home */}
          <div className="text-center flex-1">
            {match.homeTeam?.logo && (
              <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-16 h-16 mx-auto mb-2 object-contain" />
            )}
            {!match.homeTeam?.logo && (
              <div className={`w-16 h-16 mx-auto mb-2 rounded-xl flex items-center justify-center ${isHome ? 'gradient-bg' : darkMode ? 'bg-barca-dark-surface border border-barca-dark-border' : 'bg-barca-away-surface border border-barca-away-border'}`}>
                <span className={`text-sm font-bold ${isHome ? 'text-white' : darkMode ? 'text-gray-300' : 'text-barca-away-text'}`}>
                  {(match.homeTeam?.shortName || 'HOM').substring(0, 3).toUpperCase()}
                </span>
              </div>
            )}
            <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{match.homeTeam?.name}</p>
            {isHome && <span className={`text-[9px] font-bold tracking-wider ${darkMode ? 'text-barca-gold' : 'text-barca-gold-dark'}`}>BARÇA</span>}
          </div>

          {/* Score */}
          <div className="text-center">
            {match.status === 'FINISHED' ? (
              <>
                <div className="flex items-center gap-3">
                  <span className={`text-4xl font-bold font-heading ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{match.score?.fullTime?.home}</span>
                  <span className="text-lg text-gray-500">–</span>
                  <span className={`text-4xl font-bold font-heading ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{match.score?.fullTime?.away}</span>
                </div>
                {result && (
                  <span className={`mt-2 inline-block text-xs font-bold px-3 py-1 rounded-full border ${getResultBadgeClass(result)}`}>
                    {result}
                  </span>
                )}
                {match.score?.halfTime?.home != null && (
                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
                    HT: {match.score.halfTime.home} – {match.score.halfTime.away}
                  </p>
                )}
              </>
            ) : (
              <div>
                <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{formatMatchTime(match.utcDate)}</p>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${darkMode ? 'text-barca-blue-light bg-barca-blue/15' : 'text-barca-red bg-barca-red/10'}`}>
                  UPCOMING
                </span>
              </div>
            )}
          </div>

          {/* Away */}
          <div className="text-center flex-1">
            {match.awayTeam?.logo && (
              <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-16 h-16 mx-auto mb-2 object-contain" />
            )}
            {!match.awayTeam?.logo && (
              <div className={`w-16 h-16 mx-auto mb-2 rounded-xl flex items-center justify-center ${!isHome ? 'gradient-bg' : darkMode ? 'bg-barca-dark-surface border border-barca-dark-border' : 'bg-barca-away-surface border border-barca-away-border'}`}>
                <span className={`text-sm font-bold ${!isHome ? 'text-white' : darkMode ? 'text-gray-300' : 'text-barca-away-text'}`}>
                  {(match.awayTeam?.shortName || 'AWY').substring(0, 3).toUpperCase()}
                </span>
              </div>
            )}
            <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{match.awayTeam?.name}</p>
            {!isHome && <span className={`text-[9px] font-bold tracking-wider ${darkMode ? 'text-barca-gold' : 'text-barca-gold-dark'}`}>BARÇA</span>}
          </div>
        </div>

        {/* Date */}
        <div className={`text-center pt-4 border-t ${darkMode ? 'border-barca-dark-border/50' : 'border-barca-away-border/50'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>
            {formatMatchDate(match.utcDate)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MatchDetail