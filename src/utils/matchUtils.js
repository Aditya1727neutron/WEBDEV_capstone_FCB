/**
 * Utility functions for match data processing.
 * Works with the normalized match shape from API-Football.
 *
 * Barcelona team ID in API-Football = 529
 */

const BARCA_TEAM_ID = 529

// ─── Match Result ───────────────────────────────────────────────────────────

export function getMatchResult(match) {
  if (match.status !== 'FINISHED') return null
  const home = match.score?.fullTime?.home
  const away = match.score?.fullTime?.away
  if (home == null || away == null) return null
  const isHome = match.homeTeam?.id === BARCA_TEAM_ID
  const barcaGoals = isHome ? home : away
  const oppGoals = isHome ? away : home
  if (barcaGoals > oppGoals) return 'WIN'
  if (barcaGoals < oppGoals) return 'LOSS'
  return 'DRAW'
}

export function isBarcaHome(match) {
  return match.homeTeam?.id === BARCA_TEAM_ID
}

export function getBarcaScore(match) {
  return isBarcaHome(match) ? match.score?.fullTime?.home : match.score?.fullTime?.away
}

export function getOpponentScore(match) {
  return isBarcaHome(match) ? match.score?.fullTime?.away : match.score?.fullTime?.home
}

// ─── Result Badge Classes ───────────────────────────────────────────────────

export function getResultBadgeClass(result) {
  switch (result) {
    case 'WIN': return 'bg-green-500/15 text-green-400 border-green-500/20'
    case 'LOSS': return 'bg-red-500/15 text-red-400 border-red-500/20'
    case 'DRAW': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'
    default: return 'bg-gray-500/15 text-gray-400 border-gray-500/20'
  }
}

// ─── Formatting ─────────────────────────────────────────────────────────────

export function formatMatchDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function formatMatchTime(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  })
}

// ─── Position Helpers ───────────────────────────────────────────────────────

export function formatPosition(position) {
  switch (position) {
    case 'Goalkeeper': return 'GK'
    case 'Defence': return 'DEF'
    case 'Midfield': return 'MID'
    case 'Offence': return 'FWD'
    default: return 'N/A'
  }
}

export function getPositionColor(position) {
  switch (position) {
    case 'Goalkeeper': return 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
    case 'Defence': return 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
    case 'Midfield': return 'bg-green-500/15 text-green-400 border border-green-500/20'
    case 'Offence': return 'bg-red-500/15 text-red-400 border border-red-500/20'
    default: return 'bg-gray-500/15 text-gray-400 border border-gray-500/20'
  }
}

// ─── Sorting ────────────────────────────────────────────────────────────────

export function sortByDateDesc(matches) {
  return [...matches].sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
}

export function sortByDateAsc(matches) {
  return [...matches].sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
}

// ─── Season Stats Calculator ────────────────────────────────────────────────

export function calculateSeasonStats(matches) {
  const finished = matches.filter((m) => m.status === 'FINISHED')
  let wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0

  finished.forEach((m) => {
    const result = getMatchResult(m)
    if (result === 'WIN') wins++
    else if (result === 'DRAW') draws++
    else if (result === 'LOSS') losses++

    goalsFor += getBarcaScore(m) || 0
    goalsAgainst += getOpponentScore(m) || 0
  })

  const played = finished.length
  const points = wins * 3 + draws
  const goalDifference = goalsFor - goalsAgainst
  const winRate = played > 0 ? ((wins / played) * 100).toFixed(1) : '0.0'

  return { played, wins, draws, losses, goalsFor, goalsAgainst, goalDifference, points, winRate }
}