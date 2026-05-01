import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid
} from 'recharts'
import { getMatchResult } from '../utils/matchUtils'

const PIE_COLORS = ['#22c55e', '#EDBB00', '#ef4444']

export function SeasonPieChart({ stats }) {
  const { darkMode } = useSelector((s) => s.ui)
  const data = useMemo(() => [
    { name: 'Wins', value: stats.wins },
    { name: 'Draws', value: stats.draws },
    { name: 'Losses', value: stats.losses },
  ], [stats])

  const tooltipStyle = darkMode
    ? { background: '#0f1a38', border: '1px solid #1a2d5a', borderRadius: '12px', color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }
    : { background: '#fff', border: '1px solid #F0D070', borderRadius: '12px', color: '#5C1A00', boxShadow: '0 8px 24px rgba(92,26,0,0.1)' }

  return (
    <div className="glass-card p-5 chart-container">
      <h3 className="section-title">Season Results</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
            stroke="none">
            {data.map((entry, index) => (<Cell key={entry.name} fill={PIE_COLORS[index]} />))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TopScorersChart({ players }) {
  const { darkMode } = useSelector((s) => s.ui)

  const topScorers = useMemo(() =>
    [...players]
      .filter((p) => p.stats && p.stats.goals > 0)
      .sort((a, b) => b.stats.goals - a.stats.goals)
      .slice(0, 6)
      .map((p) => ({ name: p.name.split(' ').pop(), goals: p.stats.goals, assists: p.stats.assists }))
  , [players])

  const tooltipStyle = darkMode
    ? { background: '#0f1a38', border: '1px solid #1a2d5a', borderRadius: '12px', color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }
    : { background: '#fff', border: '1px solid #F0D070', borderRadius: '12px', color: '#5C1A00', boxShadow: '0 8px 24px rgba(92,26,0,0.1)' }
  const tickColor = darkMode ? '#6b7280' : '#8B5E3C'
  const barColor1 = darkMode ? '#004D98' : '#A50044'
  const barColor2 = darkMode ? '#EDBB00' : '#EDBB00'

  return (
    <div className="glass-card p-5 chart-container">
      <h3 className="section-title">Top Scorers</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={topScorers} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1a2d5a' : '#F0D070'} opacity={0.3} />
          <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: darkMode ? 'rgba(0,77,152,0.1)' : 'rgba(165,0,68,0.05)' }} />
          <Bar dataKey="goals" fill={barColor1} radius={[6, 6, 0, 0]} name="Goals" />
          <Bar dataKey="assists" fill={barColor2} radius={[6, 6, 0, 0]} name="Assists" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function FormChart({ matches }) {
  const { darkMode } = useSelector((s) => s.ui)

  const formData = useMemo(() => {
    const finished = matches
      .filter((m) => m.status === 'FINISHED')
      .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
      .slice(-10)

    return finished.map((m, i) => {
      const result = getMatchResult(m)
      const points = result === 'WIN' ? 3 : result === 'DRAW' ? 1 : 0
      const opponent = m.homeTeam.id === 81
        ? (m.awayTeam?.shortName || m.awayTeam?.name || 'OPP').substring(0, 3)
        : (m.homeTeam?.shortName || m.homeTeam?.name || 'OPP').substring(0, 3)
      return { match: opponent, points, result, index: i + 1 }
    })
  }, [matches])

  const tooltipStyle = darkMode
    ? { background: '#0f1a38', border: '1px solid #1a2d5a', borderRadius: '12px', color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }
    : { background: '#fff', border: '1px solid #F0D070', borderRadius: '12px', color: '#5C1A00', boxShadow: '0 8px 24px rgba(92,26,0,0.1)' }

  if (formData.length === 0) return null

  return (
    <div className="glass-card p-5 chart-container">
      <h3 className="section-title">Form (Last {formData.length} Matches)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={formData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
          <defs>
            <linearGradient id="formGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={darkMode ? '#004D98' : '#A50044'} stopOpacity={0.4} />
              <stop offset="95%" stopColor={darkMode ? '#004D98' : '#A50044'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1a2d5a' : '#F0D070'} opacity={0.3} />
          <XAxis dataKey="match" tick={{ fill: darkMode ? '#6b7280' : '#8B5E3C', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 3]} ticks={[0, 1, 3]} tick={{ fill: darkMode ? '#6b7280' : '#8B5E3C', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="points" stroke={darkMode ? '#004D98' : '#A50044'} fill="url(#formGradient)" strokeWidth={2} name="Points" dot={{ r: 4, fill: darkMode ? '#1a6ab5' : '#c4175f' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function ChartComponent({ stats, players, matches }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {stats && <SeasonPieChart stats={stats} />}
      {players && players.length > 0 && <TopScorersChart players={players} />}
      {matches && matches.length > 0 && <FormChart matches={matches} />}
    </div>
  )
}
