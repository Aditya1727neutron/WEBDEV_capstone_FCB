import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMatches } from '../redux/matchesSlice'
import { fetchPlayers } from '../redux/playersSlice'
import { calculateSeasonStats, sortByDateDesc } from '../utils/matchUtils'
import MatchCard from '../components/MatchCard'
import ChartComponent from '../components/ChartCcomponent'
import Loader from '../components/Loader'

function Dashboard() {
  const dispatch = useDispatch()
  const { items: matches, loading: matchesLoading, usingMockData } = useSelector(s => s.matches)
  const { items: players, loading: playersLoading } = useSelector(s => s.players)
  const { darkMode } = useSelector(s => s.ui)

  useEffect(() => {
    if (matches.length === 0) dispatch(fetchMatches())
    if (players.length === 0) dispatch(fetchPlayers())
  }, [dispatch, matches.length, players.length])

  if (matchesLoading && playersLoading) return <Loader />

  const stats = calculateSeasonStats(matches)
  const recentMatches = sortByDateDesc(matches.filter(m => m.status === 'FINISHED')).slice(0, 4)

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Dashboard</h1>
        {usingMockData && (
          <span className="text-xs bg-barca-gold/20 text-barca-gold-dark dark:text-barca-gold px-3 py-1 rounded-full font-medium">Mock Data</span>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Matches Played" value={stats.played} icon="📊" darkMode={darkMode} />
        <StatCard label="Wins" value={stats.wins} sub={`${stats.winRate}% win rate`} icon="🏆" darkMode={darkMode} />
        <StatCard label="Goals Scored" value={stats.goalsFor} sub={`${stats.goalsAgainst} conceded`} icon="⚽" darkMode={darkMode} />
        <StatCard label="Points" value={stats.points} sub={`GD: +${stats.goalDifference}`} icon="📈" darkMode={darkMode} />
      </div>

      {/* Charts */}
      <div className="mb-8">
        <ChartComponent stats={stats} players={players} />
      </div>

      {/* Recent Matches */}
      <div>
        <h2 className="section-title">Recent Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentMatches.map(match => <MatchCard key={match.id} match={match} />)}
        </div>
        {recentMatches.length === 0 && (
          <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>No matches available</p>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, icon, darkMode }) {
  return (
    <div className="stat-card animate-slide-up">
      <span className="text-2xl">{icon}</span>
      <p className={`text-2xl md:text-3xl font-bold font-heading ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{value}</p>
      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>{label}</p>
      {sub && <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted/70'}`}>{sub}</p>}
    </div>
  )
}

export default Dashboard
