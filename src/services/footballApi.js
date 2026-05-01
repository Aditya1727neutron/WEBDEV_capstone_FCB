/**
 * Football Data API service (football-data.org)
 * Uses env variable VITE_FOOTBALL_API_TOKEN for the API key.
 */

const API_BASE = 'https://api.football-data.org/v4'
const TOKEN = import.meta.env.VITE_FOOTBALL_API_TOKEN || '22ec0788bb8940cc9c8db00194b45592'
const BARCA_TEAM_ID = 81

// ─── Generic Fetch Wrapper ──────────────────────────────────────────────────
async function apiFetch(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'X-Auth-Token': TOKEN },
  })
  if (!res.ok) {
    throw new Error(`API Error ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

// ─── API Functions ──────────────────────────────────────────────────────────

/** Fetch Barcelona matches (current season) */
export async function fetchMatches() {
  const data = await apiFetch(`/teams/${BARCA_TEAM_ID}/matches?status=SCHEDULED,FINISHED&limit=50`)
  return data.matches || []
}

/** Fetch Barcelona squad */
export async function fetchSquad() {
  const data = await apiFetch(`/teams/${BARCA_TEAM_ID}`)
  const squad = data.squad || []
  // Attach mock stats for display (API free tier doesn't include player stats)
  return squad.map((p) => ({
    ...p,
    stats: generateMockStats(p.position),
  }))
}

/** Fetch La Liga standings */
export async function fetchStandings() {
  const data = await apiFetch('/competitions/PD/standings')
  return data.standings || []
}

// ─── Mock Stats Generator ───────────────────────────────────────────────────
function generateMockStats(position) {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
  switch (position) {
    case 'Goalkeeper':
      return { appearances: rand(20, 35), goals: 0, assists: rand(0, 2), cleanSheets: rand(8, 18) }
    case 'Defence':
      return { appearances: rand(18, 35), goals: rand(0, 4), assists: rand(1, 5), cleanSheets: 0 }
    case 'Midfield':
      return { appearances: rand(20, 38), goals: rand(3, 12), assists: rand(5, 15), cleanSheets: 0 }
    case 'Offence':
      return { appearances: rand(20, 38), goals: rand(8, 28), assists: rand(3, 12), cleanSheets: 0 }
    default:
      return { appearances: rand(10, 25), goals: rand(0, 5), assists: rand(0, 5), cleanSheets: 0 }
  }
}

// ─── Mock Data (fallback when API fails / rate-limited) ─────────────────────

export const MOCK_MATCHES = [
  {
    id: 100001,
    competition: { id: 2014, name: 'La Liga' },
    homeTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça' },
    awayTeam: { id: 95, name: 'Valencia CF', shortName: 'Valencia' },
    utcDate: '2025-04-12T21:00:00Z',
    status: 'SCHEDULED',
    score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
  },
  {
    id: 100002,
    competition: { id: 2014, name: 'La Liga' },
    homeTeam: { id: 78, name: 'Club Atlético de Madrid', shortName: 'Atlético' },
    awayTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça' },
    utcDate: '2025-04-06T20:00:00Z',
    status: 'SCHEDULED',
    score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
  },
  {
    id: 100003,
    competition: { id: 2014, name: 'La Liga' },
    homeTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça' },
    awayTeam: { id: 86, name: 'Real Madrid CF', shortName: 'Real Madrid' },
    utcDate: '2025-03-16T20:00:00Z',
    status: 'FINISHED',
    score: { fullTime: { home: 4, away: 1 }, halfTime: { home: 2, away: 0 } },
  },
  {
    id: 100004,
    competition: { id: 2001, name: 'Champions League' },
    homeTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça' },
    awayTeam: { id: 5, name: 'FC Bayern München', shortName: 'Bayern' },
    utcDate: '2025-03-12T20:00:00Z',
    status: 'FINISHED',
    score: { fullTime: { home: 3, away: 2 }, halfTime: { home: 1, away: 1 } },
  },
  {
    id: 100005,
    competition: { id: 2014, name: 'La Liga' },
    homeTeam: { id: 77, name: 'Athletic Club', shortName: 'Athletic' },
    awayTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça' },
    utcDate: '2025-03-08T18:00:00Z',
    status: 'FINISHED',
    score: { fullTime: { home: 0, away: 2 }, halfTime: { home: 0, away: 1 } },
  },
  {
    id: 100006,
    competition: { id: 2014, name: 'La Liga' },
    homeTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça' },
    awayTeam: { id: 263, name: 'Deportivo Alavés', shortName: 'Alavés' },
    utcDate: '2025-03-02T16:00:00Z',
    status: 'FINISHED',
    score: { fullTime: { home: 5, away: 0 }, halfTime: { home: 3, away: 0 } },
  },
  {
    id: 100007,
    competition: { id: 2014, name: 'La Liga' },
    homeTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça' },
    awayTeam: { id: 90, name: 'Real Betis Balompié', shortName: 'Betis' },
    utcDate: '2025-02-22T20:00:00Z',
    status: 'FINISHED',
    score: { fullTime: { home: 3, away: 1 }, halfTime: { home: 1, away: 0 } },
  },
  {
    id: 100008,
    competition: { id: 2014, name: 'La Liga' },
    homeTeam: { id: 559, name: 'Sevilla FC', shortName: 'Sevilla' },
    awayTeam: { id: 81, name: 'FC Barcelona', shortName: 'Barça' },
    utcDate: '2025-02-15T18:00:00Z',
    status: 'FINISHED',
    score: { fullTime: { home: 1, away: 2 }, halfTime: { home: 1, away: 1 } },
  },
]

export const MOCK_PLAYERS = [
  { id: 1, name: 'Robert Lewandowski', position: 'Offence', nationality: 'Poland', dateOfBirth: '1988-08-21', shirtNumber: 9, stats: { appearances: 35, goals: 28, assists: 6, cleanSheets: 0 } },
  { id: 2, name: 'Lamine Yamal', position: 'Offence', nationality: 'Spain', dateOfBirth: '2007-07-13', shirtNumber: 19, stats: { appearances: 32, goals: 12, assists: 14, cleanSheets: 0 } },
  { id: 3, name: 'Raphinha', position: 'Offence', nationality: 'Brazil', dateOfBirth: '1996-12-14', shirtNumber: 11, stats: { appearances: 34, goals: 14, assists: 10, cleanSheets: 0 } },
  { id: 4, name: 'Pedri', position: 'Midfield', nationality: 'Spain', dateOfBirth: '2002-11-25', shirtNumber: 8, stats: { appearances: 30, goals: 8, assists: 12, cleanSheets: 0 } },
  { id: 5, name: 'Gavi', position: 'Midfield', nationality: 'Spain', dateOfBirth: '2004-08-05', shirtNumber: 6, stats: { appearances: 22, goals: 4, assists: 7, cleanSheets: 0 } },
  { id: 6, name: 'Frenkie de Jong', position: 'Midfield', nationality: 'Netherlands', dateOfBirth: '1997-05-12', shirtNumber: 21, stats: { appearances: 28, goals: 3, assists: 8, cleanSheets: 0 } },
  { id: 7, name: 'Marc-André ter Stegen', position: 'Goalkeeper', nationality: 'Germany', dateOfBirth: '1992-04-30', shirtNumber: 1, stats: { appearances: 30, goals: 0, assists: 1, cleanSheets: 14 } },
  { id: 8, name: 'Ronald Araújo', position: 'Defence', nationality: 'Uruguay', dateOfBirth: '1999-03-07', shirtNumber: 4, stats: { appearances: 25, goals: 3, assists: 1, cleanSheets: 0 } },
  { id: 9, name: 'Jules Koundé', position: 'Defence', nationality: 'France', dateOfBirth: '1998-11-01', shirtNumber: 23, stats: { appearances: 33, goals: 2, assists: 5, cleanSheets: 0 } },
  { id: 10, name: 'Dani Olmo', position: 'Midfield', nationality: 'Spain', dateOfBirth: '1998-05-07', shirtNumber: 20, stats: { appearances: 18, goals: 7, assists: 5, cleanSheets: 0 } },
  { id: 11, name: 'Fermín López', position: 'Midfield', nationality: 'Spain', dateOfBirth: '2003-01-07', shirtNumber: 16, stats: { appearances: 26, goals: 9, assists: 4, cleanSheets: 0 } },
  { id: 12, name: 'Alejandro Balde', position: 'Defence', nationality: 'Spain', dateOfBirth: '2003-10-18', shirtNumber: 3, stats: { appearances: 28, goals: 1, assists: 6, cleanSheets: 0 } },
]