import React from 'react'
import { useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const PIE_COLORS = ['#22c55e', '#EDBB00', '#ef4444']

export function SeasonPieChart({ stats }) {
  const { darkMode } = useSelector(s => s.ui)
  const data = [
    { name: 'Wins', value: stats.wins },
    { name: 'Draws', value: stats.draws },
    { name: 'Losses', value: stats.losses },
  ]
  const tooltipStyle = darkMode
    ? { background: '#0f1a38', border: '1px solid #1a2d5a', borderRadius: '12px', color: '#fff' }
    : { background: '#fff', border: '1px solid #F0D070', borderRadius: '12px', color: '#5C1A00' }

  return (
    <div className="glass-card p-5">
      <h3 className="section-title">Season Results</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}>
            {data.map((entry, index) => (<Cell key={entry.name} fill={PIE_COLORS[index]} />))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TopScorersChart({ players }) {
  const { darkMode } = useSelector(s => s.ui)
  const topScorers = [...players]
    .filter(p => p.stats && p.stats.goals > 0)
    .sort((a, b) => b.stats.goals - a.stats.goals)
    .slice(0, 6)
    .map(p => ({ name: p.name.split(' ').pop(), goals: p.stats.goals, assists: p.stats.assists }))

  const tooltipStyle = darkMode
    ? { background: '#0f1a38', border: '1px solid #1a2d5a', borderRadius: '12px', color: '#fff' }
    : { background: '#fff', border: '1px solid #F0D070', borderRadius: '12px', color: '#5C1A00' }
  const tickColor = darkMode ? '#9ca3af' : '#8B5E3C'
  const barColor1 = darkMode ? '#004D98' : '#A50044'
  const barColor2 = darkMode ? '#EDBB00' : '#EDBB00'

  return (
    <div className="glass-card p-5">
      <h3 className="section-title">Top Scorers</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={topScorers} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="goals" fill={barColor1} radius={[6, 6, 0, 0]} name="Goals" />
          <Bar dataKey="assists" fill={barColor2} radius={[6, 6, 0, 0]} name="Assists" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function ChartComponent({ stats, players }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {stats && <SeasonPieChart stats={stats} />}
      {players && players.length > 0 && <TopScorersChart players={players} />}
    </div>
  )
}
