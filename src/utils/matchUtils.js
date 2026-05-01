const BARCA_ID = 529

/**
 * Returns match result from Barcelona's perspective
 * @returns 'W' | 'D' | 'L'
 */
export function getMatchResult(match) {
  const { teams, goals } = match
  const isBarcaHome = teams.home.id === BARCA_ID

  const barcaGoals = isBarcaHome ? goals.home : goals.away
  const oppGoals = isBarcaHome ? goals.away : goals.home

  if (barcaGoals > oppGoals) return 'W'
  if (barcaGoals < oppGoals) return 'L'
  return 'D'
}

/**
 * Returns the opponent team object
 */
export function getOpponent(match) {
  return match.teams.home.id === BARCA_ID ? match.teams.away : match.teams.home
}

/**
 * Returns Barcelona's goal score and opponent's goal score
 */
export function getScore(match) {
  const isBarcaHome = match.teams.home.id === BARCA_ID
  return {
    barca: isBarcaHome ? match.goals.home : match.goals.away,
    opponent: isBarcaHome ? match.goals.away : match.goals.home,
  }
}

/**
 * Returns Barcelona stats from fixture statistics array
 */
export function getBarcaStats(statsArray) {
  return statsArray?.find((s) => s.team.id === BARCA_ID) || null
}

/**
 * Returns opponent stats from fixture statistics array
 */
export function getOpponentStats(statsArray) {
  return statsArray?.find((s) => s.team.id !== BARCA_ID) || null
}

/**
 * Parses a stat value (handles "54%" strings and null values)
 */
export function parseStat(value) {
  if (value === null || value === undefined) return 0
  if (typeof value === 'string' && value.endsWith('%')) {
    return parseFloat(value)
  }
  return Number(value) || 0
}

/**
 * Formats a date string to readable format
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Returns a color class based on match result
 */
export function getResultColor(result) {
  switch (result) {
    case 'W': return 'text-emerald-400'
    case 'L': return 'text-red-400'
    case 'D': return 'text-yellow-400'
    default: return 'text-gray-400'
  }
}

export function getResultBg(result) {
  switch (result) {
    case 'W': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    case 'L': return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'D': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

/**
 * Generates a smart match insight string based on stats
 */
export function generateInsight(barcaStats, oppStats) {
  if (!barcaStats || !oppStats) return null

  const insights = []

  const barcaPoss = parseStat(barcaStats.statistics?.find(s => s.type === 'Ball Possession')?.value)
  const barcaShots = parseStat(barcaStats.statistics?.find(s => s.type === 'Total Shots')?.value)
  const oppShots = parseStat(oppStats.statistics?.find(s => s.type === 'Total Shots')?.value)
  const barcaCorners = parseStat(barcaStats.statistics?.find(s => s.type === 'Corner Kicks')?.value)
  const barcaFouls = parseStat(barcaStats.statistics?.find(s => s.type === 'Fouls')?.value)
  const oppFouls = parseStat(oppStats.statistics?.find(s => s.type === 'Fouls')?.value)

  if (barcaPoss > 55) insights.push(`Barcelona dominated possession with ${barcaPoss}%`)
  if (barcaShots > oppShots) insights.push(`created more attacking chances (${barcaShots} shots vs ${oppShots})`)
  if (barcaCorners > 5) insights.push(`earned ${barcaCorners} corner kicks showing sustained pressure`)
  if (barcaFouls < oppFouls) insights.push(`played a disciplined game with fewer fouls`)

  if (insights.length === 0) return 'A competitive fixture with both teams testing each other throughout.'
  return insights.join(', ') + '.'
}

/**
 * Groups matches by competition name
 */
export function groupByCompetition(matches) {
  return matches.reduce((acc, match) => {
    const name = match.league.name
    if (!acc[name]) acc[name] = []
    acc[name].push(match)
    return acc
  }, {})
}

/**
 * Computes season summary stats from matches array
 */
export function computeSeasonStats(matches) {
  const played = matches.filter((m) => m.fixture.status.short === 'FT')
  let wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0

  played.forEach((m) => {
    const result = getMatchResult(m)
    const score = getScore(m)
    if (result === 'W') wins++
    else if (result === 'D') draws++
    else losses++
    goalsFor += score.barca || 0
    goalsAgainst += score.opponent || 0
  })

  return { played: played.length, wins, draws, losses, goalsFor, goalsAgainst }
}