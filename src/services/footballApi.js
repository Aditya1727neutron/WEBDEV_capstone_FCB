import axios from 'axios'

/**
 * API-Football (RapidAPI) service
 * All data comes from real API — NO mock data, NO dummy arrays.
 *
 * Responses are normalized to a consistent shape consumed by Redux slices
 * and UI components across the entire app.
 */

// ─── Axios Instance ─────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: 'https://api-football-v1.p.rapidapi.com/v3',
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
  },
  timeout: 15000,
})

// ─── Response Interceptor ───────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API-Football] ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    const status = error.response?.status
    if (status === 401) console.error('[API] 401 Unauthorized — check your VITE_API_KEY')
    else if (status === 403) console.error('[API] 403 Forbidden — your plan may not include this endpoint')
    else if (status === 429) console.error('[API] 429 Rate limit exceeded — wait before retrying')
    else console.error(`[API] Error ${status}:`, error.message)
    return Promise.reject(error)
  }
)

// ─── Constants ──────────────────────────────────────────────────────────────
const BARCA_TEAM_ID = 529      // Barcelona ID in API-Football
const LA_LIGA_ID = 140          // La Liga league ID

// ─── Normalizers ────────────────────────────────────────────────────────────
// These transform the raw API-Football response into the flat shape our
// MatchCard / PlayerCard / ChartComponent components already consume.

/**
 * Normalize a fixture from API-Football format to our app's match format.
 */
function normalizeMatch(raw) {
  const { fixture, league, teams, goals, score } = raw

  // Map API-Football status to our status convention
  let status = 'SCHEDULED'
  const shortStatus = fixture.status?.short
  if (['FT', 'AET', 'PEN'].includes(shortStatus)) status = 'FINISHED'
  else if (['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE'].includes(shortStatus)) status = 'IN_PLAY'
  else if (['PST', 'CANC', 'ABD', 'AWD', 'WO', 'SUSP', 'INT'].includes(shortStatus)) status = 'CANCELLED'

  return {
    id: fixture.id,
    utcDate: fixture.date,
    status,
    competition: {
      id: league.id,
      name: league.name,
    },
    homeTeam: {
      id: teams.home.id,
      name: teams.home.name,
      shortName: teams.home.name?.split(' ').pop() || teams.home.name,
      logo: teams.home.logo,
    },
    awayTeam: {
      id: teams.away.id,
      name: teams.away.name,
      shortName: teams.away.name?.split(' ').pop() || teams.away.name,
      logo: teams.away.logo,
    },
    score: {
      fullTime: {
        home: goals.home,
        away: goals.away,
      },
      halfTime: {
        home: score?.halftime?.home ?? null,
        away: score?.halftime?.away ?? null,
      },
    },
  }
}

/**
 * Normalize a player+statistics entry from API-Football to our player format.
 */
function normalizePlayer(raw) {
  const { player, statistics } = raw
  // Take the first (most relevant) statistics entry
  const stat = statistics?.[0] || {}
  const games = stat.games || {}
  const playerGoals = stat.goals || {}
  const passes = stat.passes || {}

  // Map API-Football position to our position convention
  let position = games.position || 'Unknown'
  if (position === 'Attacker') position = 'Offence'
  else if (position === 'Midfielder') position = 'Midfield'
  else if (position === 'Defender') position = 'Defence'

  return {
    id: player.id,
    name: player.name,
    firstName: player.firstname,
    lastName: player.lastname,
    photo: player.photo,
    nationality: player.nationality,
    dateOfBirth: player.birth?.date || null,
    age: player.age,
    position,
    shirtNumber: games.number || null,
    stats: {
      appearances: games.appearences ?? 0,   // Note: API uses "appearences" (their typo)
      goals: playerGoals.total ?? 0,
      assists: playerGoals.assists ?? 0,
      cleanSheets: games.position === 'Goalkeeper' ? (stat.goals?.saves ?? 0) : 0,
      rating: games.rating ? parseFloat(games.rating) : null,
      minutes: games.minutes ?? 0,
      passes: passes.total ?? 0,
      passAccuracy: passes.accuracy ? parseInt(passes.accuracy) : 0,
    },
  }
}

// ─── API Functions ──────────────────────────────────────────────────────────

/**
 * Fetch Barcelona matches for a given season.
 * @param {number} season - e.g. 2024
 * @returns {Promise<Array>} Normalized match objects
 */
export async function getBarcelonaMatches(season = 2024) {
  const res = await apiClient.get('/fixtures', {
    params: { team: BARCA_TEAM_ID, season },
  })
  const raw = res.data?.response || []
  console.log(`[API] Fetched ${raw.length} fixtures for season ${season}`)
  return raw.map(normalizeMatch)
}

/**
 * Fetch Barcelona squad/players for a given season.
 * The /players endpoint is paginated — we fetch all pages.
 * @param {number} season - e.g. 2024
 * @returns {Promise<Array>} Normalized player objects
 */
export async function getBarcelonaPlayers(season = 2024) {
  let allPlayers = []
  let page = 1
  let totalPages = 1

  do {
    const res = await apiClient.get('/players', {
      params: { team: BARCA_TEAM_ID, season, page },
    })
    const data = res.data
    const players = data?.response || []
    allPlayers = allPlayers.concat(players.map(normalizePlayer))
    totalPages = data?.paging?.total || 1
    page++
    console.log(`[API] Players page ${page - 1}/${totalPages}, got ${players.length}`)
  } while (page <= totalPages)

  return allPlayers
}

/**
 * Fetch detailed info for a single match/fixture.
 * @param {number} fixtureId
 * @returns {Promise<Object>} Normalized match object with extra details
 */
export async function getMatchDetails(fixtureId) {
  const [fixtureRes, statsRes] = await Promise.all([
    apiClient.get('/fixtures', { params: { id: fixtureId } }),
    apiClient.get('/fixtures/statistics', { params: { fixture: fixtureId } }).catch(() => ({ data: { response: [] } })),
  ])

  const raw = fixtureRes.data?.response?.[0]
  if (!raw) throw new Error(`Fixture ${fixtureId} not found`)

  const match = normalizeMatch(raw)

  // Attach raw events, lineups, and statistics for the detail page
  match.events = raw.events || []
  match.lineups = raw.lineups || []
  match.statistics = statsRes.data?.response || []

  return match
}

/**
 * Fetch La Liga standings for the current season.
 * @param {number} season
 * @returns {Promise<Array>} Standings table
 */
export async function getStandings(season = 2024) {
  const res = await apiClient.get('/standings', {
    params: { league: LA_LIGA_ID, season },
  })
  const standings = res.data?.response?.[0]?.league?.standings?.[0] || []
  console.log(`[API] Standings: ${standings.length} teams`)
  return standings
}

// ─── Exported Constants ─────────────────────────────────────────────────────
export { BARCA_TEAM_ID, LA_LIGA_ID }
export default apiClient