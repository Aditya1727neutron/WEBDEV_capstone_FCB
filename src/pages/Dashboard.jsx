import React, { useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMatches } from '../redux/matchesSlice'
import { fetchPlayers } from '../redux/playersSlice'
import { fetchStandingsData } from '../redux/standingsSlice'
import { calculateSeasonStats, sortByDateDesc, getMatchResult } from '../utils/matchUtils'
import { useAutoRefresh } from '../hooks'
import MatchCard from '../components/MatchCard'
import ChartComponent from '../components/ChartComponent'
import SkeletonCard from '../components/SkeletonCard'

function Dashboard() {
  const dispatch = useDispatch()
  const { items: matches, loading: matchesLoading, usingMockData } = useSelector((s) => s.matches)
  const { items: players, loading: playersLoading } = useSelector((s) => s.players)
  const { barcaPosition } = useSelector((s) => s.standings)
  const { darkMode } = useSelector((s) => s.ui)

  const doRefresh = useCallback(() => {
    dispatch(fetchMatches())
    dispatch(fetchPlayers())
    dispatch(fetchStandingsData())
  }, [dispatch])

  useEffect(() => {
    if (matches.length === 0) dispatch(fetchMatches())
    if (players.length === 0) dispatch(fetchPlayers())
    dispatch(fetchStandingsData())
  }, [dispatch, matches.length, players.length])

  const { lastRefreshed, secondsUntilRefresh, refresh, isRefreshing } = useAutoRefresh(doRefresh, 120000)

  const stats = useMemo(() => calculateSeasonStats(matches), [matches])
  const recentMatches = useMemo(
    () => sortByDateDesc(matches.filter((m) => m.status === 'FINISHED')).slice(0, 4),
    [matches]
  )
  const upcomingMatch = useMemo(
    () => matches.filter((m) => m.status === 'SCHEDULED').sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))[0],
    [matches]
  )

  // Form guide (last 5)
  const formGuide = useMemo(() => {
    return sortByDateDesc(matches.filter((m) => m.status === 'FINISHED'))
      .slice(0, 5)
      .reverse()
      .map((m) => getMatchResult(m))
  }, [matches])

  const isLoading = matchesLoading && playersLoading

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title mb-1">Dashboard</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
            Season overview & analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          {usingMockData && (
            <span className="text-[10px] bg-barca-gold/15 text-barca-gold-dark dark:text-barca-gold px-3 py-1.5 rounded-full font-semibold border border-barca-gold/20">
              📡 Demo Data
            </span>
          )}
          <button
            onClick={refresh}
            className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
            title={`Auto-refresh in ${secondsUntilRefresh}s`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          {lastRefreshed && (
            <span className={`text-[10px] ${darkMode ? 'text-gray-600' : 'text-barca-away-text-muted'}`}>
              {secondsUntilRefresh}s
            </span>
          )}
        </div>
      </div>

      {/* Hero: Next Match + League Position + Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 stagger-children">
        {/* Next Match Countdown */}
        <div className="glass-card p-5 md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 gradient-bg" />
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
            Next Match
          </h3>
          {upcomingMatch ? (
            <NextMatchWidget match={upcomingMatch} darkMode={darkMode} />
          ) : (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>No upcoming matches scheduled</p>
          )}
        </div>

        {/* League Position + Form */}
        <div className="flex flex-col gap-4">
          {/* League Position */}
          <div className="glass-card p-5 relative overflow-hidden flex-1">
            <div className="absolute top-0 left-0 right-0 h-1 gradient-bg" />
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
              La Liga
            </h3>
            {barcaPosition ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg font-heading">#{barcaPosition.position}</span>
                </div>
                <div>
                  <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{barcaPosition.points} pts</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
                    W{barcaPosition.won} D{barcaPosition.draw} L{barcaPosition.lost}
                  </p>
                </div>
              </div>
            ) : (
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>Loading...</p>
            )}
          </div>

          {/* Form Guide */}
          <div className="glass-card p-5">
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
              Form
            </h3>
            <div className="flex gap-2">
              {formGuide.map((result, i) => (
                <div key={i} className={`form-dot ${result === 'WIN' ? 'form-dot-win' : result === 'DRAW' ? 'form-dot-draw' : 'form-dot-loss'}`}>
                  {result === 'WIN' ? 'W' : result === 'DRAW' ? 'D' : 'L'}
                </div>
              ))}
              {formGuide.length === 0 && (
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>No data</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} variant="stat" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger-children">
          <StatCard label="Matches Played" value={stats.played} icon="📊" darkMode={darkMode} />
          <StatCard label="Wins" value={stats.wins} sub={`${stats.winRate}% win rate`} icon="🏆" darkMode={darkMode} />
          <StatCard label="Goals Scored" value={stats.goalsFor} sub={`${stats.goalsAgainst} conceded`} icon="⚽" darkMode={darkMode} />
          <StatCard label="Points" value={stats.points} sub={`GD: +${stats.goalDifference}`} icon="📈" darkMode={darkMode} />
        </div>
      )}

      {/* Charts */}
      <div className="mb-8">
        <ChartComponent stats={stats} players={players} matches={matches} />
      </div>

      {/* Recent Matches */}
      <div>
        <h2 className="section-title">Recent Matches</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} variant="match" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
            {recentMatches.map((match) => <MatchCard key={match.id} match={match} />)}
          </div>
        )}
        {!isLoading && recentMatches.length === 0 && (
          <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>No matches available</p>
        )}
      </div>
    </div>
  )
}

/* ===== Sub-components ===== */

function NextMatchWidget({ match, darkMode }) {
  const opponent = match.homeTeam.id === 81 ? match.awayTeam : match.homeTeam
  const isHome = match.homeTeam.id === 81
  const matchDate = new Date(match.utcDate)

  // Countdown
  const now = new Date()
  const diff = matchDate - now
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
  const mins = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)))

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xs font-heading">FCB</span>
        </div>
        <span className={`text-lg font-light ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>vs</span>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${darkMode ? 'bg-barca-dark-surface border border-barca-dark-border' : 'bg-barca-away-surface border border-barca-away-border'}`}>
          <span className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-barca-away-text'}`}>
            {(opponent?.shortName || opponent?.name || 'OPP').substring(0, 3).toUpperCase()}
          </span>
        </div>
      </div>
      <div className="flex-1">
        <p className={`text-sm font-bold mb-1 ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>
          {opponent?.name || 'Opponent'}
        </p>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>
          {match.competition?.name} • {isHome ? 'Home' : 'Away'}
        </p>
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
          {matchDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>
      {diff > 0 && (
        <div className="flex gap-3">
          <div className="countdown-unit">
            <span className={`countdown-value ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{days}</span>
            <span className={`countdown-label ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>Days</span>
          </div>
          <span className={`text-xl font-light self-start mt-1 ${darkMode ? 'text-gray-600' : 'text-barca-away-border'}`}>:</span>
          <div className="countdown-unit">
            <span className={`countdown-value ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{hours}</span>
            <span className={`countdown-label ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>Hrs</span>
          </div>
          <span className={`text-xl font-light self-start mt-1 ${darkMode ? 'text-gray-600' : 'text-barca-away-border'}`}>:</span>
          <div className="countdown-unit">
            <span className={`countdown-value ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{mins}</span>
            <span className={`countdown-label ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>Min</span>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, sub, icon, darkMode }) {
  return (
    <div className="stat-card group">
      <div className="flex items-center justify-between">
        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
      </div>
      <p className={`text-3xl md:text-4xl font-bold font-heading animate-number ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>
        {value}
      </p>
      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>{label}</p>
      {sub && <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-barca-away-text-muted/70'}`}>{sub}</p>}
    </div>
  )
}

export default Dashboard
