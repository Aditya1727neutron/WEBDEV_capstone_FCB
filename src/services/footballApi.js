// Football Data API Service
// Using football-data.org API v4 — filtered for FC Barcelona (team ID: 81)

const API_TOKEN = '22ec0788bb8940cc9c8db00194b45592'
const BASE_URL = 'https://api.football-data.org/v4'
const BARCA_TEAM_ID = 81
const LA_LIGA_CODE = 'PD'

const headers = {
  'X-Auth-Token': API_TOKEN,
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, { headers })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API Error: ${response.status}`)
  }
  return response.json()
}

/**
 * Get Barcelona team info including current squad
 */
export async function fetchTeamInfo() {
  const data = await apiFetch(`/teams/${BARCA_TEAM_ID}`)
  return data
}

/**
 * Get Barcelona's matches (current season)
 * Filters: status can be SCHEDULED, LIVE, IN_PLAY, PAUSED, FINISHED, POSTPONED, CANCELLED
 */
export async function fetchMatches(status = null) {
  let endpoint = `/teams/${BARCA_TEAM_ID}/matches?season=2024`
  if (status) {
    endpoint += `&status=${status}`
  }
  const data = await apiFetch(endpoint)
  return data.matches || []
}

/**
 * Get Barcelona's finished matches
 */
export async function fetchFinishedMatches() {
  return fetchMatches('FINISHED')
}

/**
 * Get Barcelona's upcoming matches
 */
export async function fetchUpcomingMatches() {
  return fetchMatches('SCHEDULED')
}

/**
 * Get La Liga standings
 */
export async function fetchStandings() {
  const data = await apiFetch(`/competitions/${LA_LIGA_CODE}/standings?season=2024`)
  return data.standings || []
}

/**
 * Get Barcelona's squad / players
 */
export async function fetchSquad() {
  const data = await apiFetch(`/teams/${BARCA_TEAM_ID}`)
  return (data.squad || []).map((player, index) => ({
    id: player.id,
    name: player.name,
    position: player.position || 'Unknown',
    dateOfBirth: player.dateOfBirth,
    nationality: player.nationality,
    shirtNumber: player.shirtNumber,
    // The free API doesn't include detailed stats per player,
    // so we add placeholder stats that can be replaced with a premium API
    stats: {
      appearances: Math.floor(Math.random() * 30) + 5,
      goals: player.position === 'Offence' ? Math.floor(Math.random() * 20) + 3 :
             player.position === 'Midfield' ? Math.floor(Math.random() * 8) :
             Math.floor(Math.random() * 3),
      assists: player.position === 'Midfield' ? Math.floor(Math.random() * 12) + 2 :
               player.position === 'Offence' ? Math.floor(Math.random() * 10) :
               Math.floor(Math.random() * 4),
      cleanSheets: player.position === 'Goalkeeper' ? Math.floor(Math.random() * 15) + 5 : 0,
    }
  }))
}

/**
 * Get a specific match by ID
 */
export async function fetchMatchById(matchId) {
  const data = await apiFetch(`/matches/${matchId}`)
  return data
}

/**
 * Get Barcelona's position from La Liga standings
 */
export async function fetchBarcaStanding() {
  const standings = await fetchStandings()
  if (standings.length > 0) {
    const totalTable = standings.find(s => s.type === 'TOTAL')
    if (totalTable) {
      const barcaRow = totalTable.table.find(row => row.team.id === BARCA_TEAM_ID)
      return barcaRow || null
    }
  }
  return null
}

// ============================================================
// MOCK DATA FALLBACK
// Used when API calls fail (rate limiting, network issues, etc.)
// ============================================================

export const MOCK_MATCHES = [
  {
    id: 1001,
    competition: { name: 'La Liga', code: 'PD', emblem: '' },
    utcDate: '2025-03-15T20:00:00Z',
    status: 'FINISHED',
    homeTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça', crest: '' },
    awayTeam: { id: 86, name: 'Real Madrid CF', shortName: 'Real Madrid', crest: '' },
    score: { fullTime: { home: 4, away: 1 }, halfTime: { home: 2, away: 0 } },
  },
  {
    id: 1002,
    competition: { name: 'Champions League', code: 'CL', emblem: '' },
    utcDate: '2025-03-11T20:00:00Z',
    status: 'FINISHED',
    homeTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça', crest: '' },
    awayTeam: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: '' },
    score: { fullTime: { home: 3, away: 2 }, halfTime: { home: 1, away: 1 } },
  },
  {
    id: 1003,
    competition: { name: 'La Liga', code: 'PD', emblem: '' },
    utcDate: '2025-03-08T17:30:00Z',
    status: 'FINISHED',
    homeTeam: { id: 77, name: 'Athletic Club', shortName: 'Athletic', crest: '' },
    awayTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça', crest: '' },
    score: { fullTime: { home: 0, away: 2 }, halfTime: { home: 0, away: 1 } },
  },
  {
    id: 1004,
    competition: { name: 'La Liga', code: 'PD', emblem: '' },
    utcDate: '2025-03-01T20:00:00Z',
    status: 'FINISHED',
    homeTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça', crest: '' },
    awayTeam: { id: 263, name: 'Deportivo Alavés', shortName: 'Alavés', crest: '' },
    score: { fullTime: { home: 5, away: 0 }, halfTime: { home: 3, away: 0 } },
  },
  {
    id: 1005,
    competition: { name: 'Champions League', code: 'CL', emblem: '' },
    utcDate: '2025-02-25T20:00:00Z',
    status: 'FINISHED',
    homeTeam: { id: 113, name: 'SSC Napoli', shortName: 'Napoli', crest: '' },
    awayTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça', crest: '' },
    score: { fullTime: { home: 1, away: 3 }, halfTime: { home: 1, away: 1 } },
  },
  {
    id: 1006,
    competition: { name: 'La Liga', code: 'PD', emblem: '' },
    utcDate: '2025-02-22T17:30:00Z',
    status: 'FINISHED',
    homeTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça', crest: '' },
    awayTeam: { id: 90, name: 'Real Betis', shortName: 'Betis', crest: '' },
    score: { fullTime: { home: 3, away: 1 }, halfTime: { home: 2, away: 0 } },
  },
  {
    id: 1007,
    competition: { name: 'La Liga', code: 'PD', emblem: '' },
    utcDate: '2025-04-05T20:00:00Z',
    status: 'SCHEDULED',
    homeTeam: { id: 78, name: 'Club Atlético de Madrid', shortName: 'Atlético', crest: '' },
    awayTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça', crest: '' },
    score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
  },
  {
    id: 1008,
    competition: { name: 'La Liga', code: 'PD', emblem: '' },
    utcDate: '2025-04-12T17:30:00Z',
    status: 'SCHEDULED',
    homeTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça', crest: '' },
    awayTeam: { id: 95, name: 'Valencia CF', shortName: 'Valencia', crest: '' },
    score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
  },
]

export const MOCK_PLAYERS = [
  { id: 2001, name: 'Marc-André ter Stegen', position: 'Goalkeeper', nationality: 'Germany', shirtNumber: 1, dateOfBirth: '1992-04-30', stats: { appearances: 28, goals: 0, assists: 0, cleanSheets: 14 } },
  { id: 2002, name: 'Ronald Araújo', position: 'Defence', nationality: 'Uruguay', shirtNumber: 4, dateOfBirth: '1999-03-07', stats: { appearances: 22, goals: 2, assists: 1, cleanSheets: 0 } },
  { id: 2003, name: 'Jules Koundé', position: 'Defence', nationality: 'France', shirtNumber: 23, dateOfBirth: '1998-11-12', stats: { appearances: 30, goals: 3, assists: 5, cleanSheets: 0 } },
  { id: 2004, name: 'Pau Cubarsí', position: 'Defence', nationality: 'Spain', shirtNumber: 2, dateOfBirth: '2007-01-22', stats: { appearances: 32, goals: 1, assists: 2, cleanSheets: 0 } },
  { id: 2005, name: 'Alejandro Balde', position: 'Defence', nationality: 'Spain', shirtNumber: 3, dateOfBirth: '2003-10-18', stats: { appearances: 26, goals: 1, assists: 7, cleanSheets: 0 } },
  { id: 2006, name: 'Pedri', position: 'Midfield', nationality: 'Spain', shirtNumber: 8, dateOfBirth: '2002-11-25', stats: { appearances: 34, goals: 8, assists: 10, cleanSheets: 0 } },
  { id: 2007, name: 'Gavi', position: 'Midfield', nationality: 'Spain', shirtNumber: 6, dateOfBirth: '2004-08-05', stats: { appearances: 18, goals: 3, assists: 5, cleanSheets: 0 } },
  { id: 2008, name: 'Frenkie de Jong', position: 'Midfield', nationality: 'Netherlands', shirtNumber: 21, dateOfBirth: '1997-05-12', stats: { appearances: 20, goals: 2, assists: 6, cleanSheets: 0 } },
  { id: 2009, name: 'Dani Olmo', position: 'Midfield', nationality: 'Spain', shirtNumber: 20, dateOfBirth: '1998-05-07', stats: { appearances: 15, goals: 6, assists: 4, cleanSheets: 0 } },
  { id: 2010, name: 'Lamine Yamal', position: 'Offence', nationality: 'Spain', shirtNumber: 19, dateOfBirth: '2007-07-13', stats: { appearances: 36, goals: 14, assists: 16, cleanSheets: 0 } },
  { id: 2011, name: 'Robert Lewandowski', position: 'Offence', nationality: 'Poland', shirtNumber: 9, dateOfBirth: '1988-08-21', stats: { appearances: 35, goals: 26, assists: 6, cleanSheets: 0 } },
  { id: 2012, name: 'Raphinha', position: 'Offence', nationality: 'Brazil', shirtNumber: 11, dateOfBirth: '1996-12-14', stats: { appearances: 34, goals: 18, assists: 11, cleanSheets: 0 } },
  { id: 2013, name: 'Fermín López', position: 'Midfield', nationality: 'Spain', shirtNumber: 16, dateOfBirth: '2003-03-07', stats: { appearances: 25, goals: 7, assists: 3, cleanSheets: 0 } },
  { id: 2014, name: 'Iñaki Peña', position: 'Goalkeeper', nationality: 'Spain', shirtNumber: 13, dateOfBirth: '1999-03-02', stats: { appearances: 10, goals: 0, assists: 0, cleanSheets: 4 } },
  { id: 2015, name: 'Andreas Christensen', position: 'Defence', nationality: 'Denmark', shirtNumber: 15, dateOfBirth: '1996-04-10', stats: { appearances: 14, goals: 0, assists: 1, cleanSheets: 0 } },
  { id: 2016, name: 'Iñigo Martínez', position: 'Defence', nationality: 'Spain', shirtNumber: 5, dateOfBirth: '1991-05-17', stats: { appearances: 24, goals: 2, assists: 0, cleanSheets: 0 } },
]
