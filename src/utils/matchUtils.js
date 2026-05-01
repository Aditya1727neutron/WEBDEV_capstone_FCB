/**
 * Utility functions for match data processing
 */

const BARCA_TEAM_ID = 81

/**
 * Format a UTC date string to a readable format
 */
export function formatMatchDate(utcDate) {
  if (!utcDate) return 'TBD'
  const date = new Date(utcDate)
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Format time from UTC date
 */
export function formatMatchTime(utcDate) {
  if (!utcDate) return ''
  const date = new Date(utcDate)
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Determine if Barcelona won, lost, or drew a match
 */
export function getMatchResult(match) {
  if (match.status !== 'FINISHED') return null

  const { home, away } = match.score.fullTime
  if (home === null || away === null) return null

  const isHome = match.homeTeam.id === BARCA_TEAM_ID
  const barcaGoals = isHome ? home : away
  const opponentGoals = isHome ? away : home

  if (barcaGoals > opponentGoals) return 'WIN'
  if (barcaGoals < opponentGoals) return 'LOSS'
  return 'DRAW'
}

/**
 * Get the opponent team for Barcelona in a match
 */
export function getOpponent(match) {
  return match.homeTeam.id === BARCA_TEAM_ID ? match.awayTeam : match.homeTeam
}

/**
 * Check if Barcelona was the home team
 */
export function isBarcaHome(match) {
  return match.homeTeam.id === BARCA_TEAM_ID
}

/**
 * Get Barcelona's score from a match
 */
export function getBarcaScore(match) {
  const isHome = match.homeTeam.id === BARCA_TEAM_ID
  return isHome ? match.score.fullTime.home : match.score.fullTime.away
}

/**
 * Get opponent's score from a match
 */
export function getOpponentScore(match) {
  const isHome = match.homeTeam.id === BARCA_TEAM_ID
  return isHome ? match.score.fullTime.away : match.score.fullTime.home
}

/**
 * Calculate season statistics from matches
 */
export function calculateSeasonStats(matches) {
  const finished = matches.filter(m => m.status === 'FINISHED')
  let wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0

  finished.forEach(match => {
    const result = getMatchResult(match)
    if (result === 'WIN') wins++
    else if (result === 'DRAW') draws++
    else if (result === 'LOSS') losses++

    goalsFor += getBarcaScore(match) || 0
    goalsAgainst += getOpponentScore(match) || 0
  })

  return {
    played: finished.length,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    points: (wins * 3) + draws,
    winRate: finished.length > 0 ? ((wins / finished.length) * 100).toFixed(1) : 0,
  }
}

/**
 * Filter matches by competition code
 */
export function filterByCompetition(matches, competitionCode) {
  if (!competitionCode || competitionCode === 'ALL') return matches
  return matches.filter(m => m.competition.code === competitionCode)
}

/**
 * Sort matches by date (newest first)
 */
export function sortByDateDesc(matches) {
  return [...matches].sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
}

/**
 * Sort matches by date (oldest first)
 */
export function sortByDateAsc(matches) {
  return [...matches].sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
}

/**
 * Get result color class based on match result
 */
export function getResultColor(result) {
  switch (result) {
    case 'WIN': return 'text-green-500'
    case 'LOSS': return 'text-red-500'
    case 'DRAW': return 'text-yellow-500'
    default: return 'text-gray-400'
  }
}

/**
 * Get result badge class based on match result
 */
export function getResultBadgeClass(result) {
  switch (result) {
    case 'WIN': return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'LOSS': return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'DRAW': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

/**
 * Map API position names to display-friendly names
 */
export function formatPosition(position) {
  const map = {
    'Goalkeeper': 'GK',
    'Defence': 'DEF',
    'Midfield': 'MID',
    'Offence': 'FWD',
    'Unknown': '—',
  }
  return map[position] || position
}

/**
 * Get position badge color
 */
export function getPositionColor(position) {
  const map = {
    'Goalkeeper': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Defence': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Midfield': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Offence': 'bg-red-500/20 text-red-400 border-red-500/30',
  }
  return map[position] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}
