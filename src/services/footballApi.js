import axios from 'axios'

// ─── Axios Instance ─────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: 'https://api-football-v1.p.rapidapi.com/v3',
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY || 'YOUR_RAPIDAPI_KEY_HERE',
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// ─── Response Interceptor ────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.response?.status, error.message)
    return Promise.reject(error)
  }
)

// ─── Barcelona Team ID ───────────────────────────────────────────────────────
const BARCA_ID = 529

// ─── API Methods ─────────────────────────────────────────────────────────────
export const footballApi = {
  /**
   * Fetch fixtures/matches
   * @param {Object} params - Query params: team, season, id, etc.
   */
  getFixtures: (params) =>
    apiClient.get('/fixtures', { params }),

  /**
   * Fetch statistics for a specific fixture
   * @param {number} fixtureId
   */
  getFixtureStats: (fixtureId) =>
    apiClient.get('/fixtures/statistics', { params: { fixture: fixtureId } }),

  /**
   * Fetch fixture events (goals, cards, substitutions)
   * @param {number} fixtureId
   */
  getFixtureEvents: (fixtureId) =>
    apiClient.get('/fixtures/events', { params: { fixture: fixtureId } }),

  /**
   * Fetch Barcelona players for a season
   * @param {Object} params - team, season, page
   */
  getPlayers: (params) =>
    apiClient.get('/players', {
      params: { ...params, team: BARCA_ID },
    }),

  /**
   * Fetch team season statistics
   * @param {number} league - League ID (e.g., 140 = La Liga)
   * @param {number} season
   */
  getTeamStats: (league, season = 2023) =>
    apiClient.get('/teams/statistics', {
      params: { team: BARCA_ID, league, season },
    }),

  /**
   * Fetch standings for a league
   * @param {number} league
   * @param {number} season
   */
  getStandings: (league, season = 2023) =>
    apiClient.get('/standings', { params: { league, season } }),
}

// ─── Mock Data Fallback ───────────────────────────────────────────────────────
// Used when API key is not configured, to allow UI preview
export const mockData = {
  fixtures: [
    {
      fixture: { id: 1035041, date: '2023-08-20T19:00:00+00:00', status: { short: 'FT' }, venue: { name: 'Camp Nou', city: 'Barcelona' } },
      league: { id: 140, name: 'La Liga', round: 'Regular Season - 1', logo: 'https://media.api-sports.io/football/leagues/140.png' },
      teams: {
        home: { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png', winner: true },
        away: { id: 547, name: 'Getafe', logo: 'https://media.api-sports.io/football/teams/547.png', winner: false },
      },
      goals: { home: 4, away: 2 },
      score: { fulltime: { home: 4, away: 2 } },
    },
    {
      fixture: { id: 1035050, date: '2023-08-27T15:15:00+00:00', status: { short: 'FT' }, venue: { name: 'Mestalla', city: 'Valencia' } },
      league: { id: 140, name: 'La Liga', round: 'Regular Season - 2', logo: 'https://media.api-sports.io/football/leagues/140.png' },
      teams: {
        home: { id: 532, name: 'Valencia', logo: 'https://media.api-sports.io/football/teams/532.png', winner: false },
        away: { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png', winner: true },
      },
      goals: { home: 1, away: 5 },
      score: { fulltime: { home: 1, away: 5 } },
    },
    {
      fixture: { id: 1035060, date: '2023-09-02T19:00:00+00:00', status: { short: 'FT' }, venue: { name: 'Camp Nou', city: 'Barcelona' } },
      league: { id: 140, name: 'La Liga', round: 'Regular Season - 3', logo: 'https://media.api-sports.io/football/leagues/140.png' },
      teams: {
        home: { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png', winner: true },
        away: { id: 798, name: 'Cadiz', logo: 'https://media.api-sports.io/football/teams/798.png', winner: false },
      },
      goals: { home: 2, away: 0 },
      score: { fulltime: { home: 2, away: 0 } },
    },
    {
      fixture: { id: 1035070, date: '2023-09-17T19:00:00+00:00', status: { short: 'FT' }, venue: { name: 'Estadio Ramon Sanchez-Pizjuan', city: 'Seville' } },
      league: { id: 140, name: 'La Liga', round: 'Regular Season - 4', logo: 'https://media.api-sports.io/football/leagues/140.png' },
      teams: {
        home: { id: 536, name: 'Sevilla', logo: 'https://media.api-sports.io/football/teams/536.png', winner: false },
        away: { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png', winner: true },
      },
      goals: { home: 1, away: 3 },
      score: { fulltime: { home: 1, away: 3 } },
    },
    {
      fixture: { id: 1035080, date: '2023-09-24T19:00:00+00:00', status: { short: 'FT' }, venue: { name: 'Camp Nou', city: 'Barcelona' } },
      league: { id: 140, name: 'La Liga', round: 'Regular Season - 5', logo: 'https://media.api-sports.io/football/leagues/140.png' },
      teams: {
        home: { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png', winner: null },
        away: { id: 548, name: 'Real Betis', logo: 'https://media.api-sports.io/football/teams/548.png', winner: null },
      },
      goals: { home: 5, away: 5 },
      score: { fulltime: { home: 5, away: 5 } },
    },
    {
      fixture: { id: 1075838, date: '2023-09-19T19:00:00+00:00', status: { short: 'FT' }, venue: { name: 'Camp Nou', city: 'Barcelona' } },
      league: { id: 2, name: 'UEFA Champions League', round: 'League Stage', logo: 'https://media.api-sports.io/football/leagues/2.png' },
      teams: {
        home: { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png', winner: true },
        away: { id: 157, name: 'Royal Antwerp', logo: 'https://media.api-sports.io/football/teams/157.png', winner: false },
      },
      goals: { home: 5, away: 0 },
      score: { fulltime: { home: 5, away: 0 } },
    },
    {
      fixture: { id: 1075840, date: '2023-10-03T19:00:00+00:00', status: { short: 'FT' }, venue: { name: 'Estádio do Sport Lisboa e Benfica', city: 'Lisbon' } },
      league: { id: 2, name: 'UEFA Champions League', round: 'League Stage', logo: 'https://media.api-sports.io/football/leagues/2.png' },
      teams: {
        home: { id: 211, name: 'Benfica', logo: 'https://media.api-sports.io/football/teams/211.png', winner: false },
        away: { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png', winner: true },
      },
      goals: { home: 3, away: 5 },
      score: { fulltime: { home: 3, away: 5 } },
    },
    {
      fixture: { id: 1035090, date: '2023-10-08T15:15:00+00:00', status: { short: 'FT' }, venue: { name: 'Camp Nou', city: 'Barcelona' } },
      league: { id: 140, name: 'La Liga', round: 'Regular Season - 8', logo: 'https://media.api-sports.io/football/leagues/140.png' },
      teams: {
        home: { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png', winner: false },
        away: { id: 541, name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png', winner: true },
      },
      goals: { home: 1, away: 2 },
      score: { fulltime: { home: 1, away: 2 } },
    },
    {
      fixture: { id: 1035100, date: '2023-10-22T19:00:00+00:00', status: { short: 'FT' }, venue: { name: 'Camp Nou', city: 'Barcelona' } },
      league: { id: 140, name: 'La Liga', round: 'Regular Season - 9', logo: 'https://media.api-sports.io/football/leagues/140.png' },
      teams: {
        home: { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png', winner: true },
        away: { id: 546, name: 'Athletic Club', logo: 'https://media.api-sports.io/football/teams/546.png', winner: false },
      },
      goals: { home: 1, away: 0 },
      score: { fulltime: { home: 1, away: 0 } },
    },
    {
      fixture: { id: 1035110, date: '2023-10-28T16:30:00+00:00', status: { short: 'FT' }, venue: { name: 'Civitas Metropolitano', city: 'Madrid' } },
      league: { id: 140, name: 'La Liga', round: 'Regular Season - 10', logo: 'https://media.api-sports.io/football/leagues/140.png' },
      teams: {
        home: { id: 530, name: 'Atletico Madrid', logo: 'https://media.api-sports.io/football/teams/530.png', winner: true },
        away: { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png', winner: false },
      },
      goals: { home: 1, away: 0 },
      score: { fulltime: { home: 1, away: 0 } },
    },
  ],

  players: [
    { player: { id: 1100, name: 'Robert Lewandowski', photo: 'https://media.api-sports.io/football/players/1100.png', nationality: 'Poland', age: 35 }, statistics: [{ games: { appearences: 34, minutes: 2850 }, goals: { total: 19, assists: 8 }, cards: { yellow: 3, red: 0 }, shots: { total: 89, on: 52 }, passes: { total: 780, accuracy: 74 }, tackles: { total: 12 }, dribbles: { attempts: 28, success: 14 }, rating: '7.51', position: 'Attacker', team: { name: 'Barcelona' } }] },
    { player: { id: 2931, name: 'Pedri', photo: 'https://media.api-sports.io/football/players/2931.png', nationality: 'Spain', age: 21 }, statistics: [{ games: { appearences: 24, minutes: 1980 }, goals: { total: 4, assists: 7 }, cards: { yellow: 4, red: 0 }, shots: { total: 38, on: 18 }, passes: { total: 1820, accuracy: 88 }, tackles: { total: 34 }, dribbles: { attempts: 65, success: 42 }, rating: '7.32', position: 'Midfielder', team: { name: 'Barcelona' } }] },
    { player: { id: 47432, name: 'Gavi', photo: 'https://media.api-sports.io/football/players/47432.png', nationality: 'Spain', age: 19 }, statistics: [{ games: { appearences: 9, minutes: 720 }, goals: { total: 0, assists: 2 }, cards: { yellow: 3, red: 0 }, shots: { total: 8, on: 3 }, passes: { total: 620, accuracy: 85 }, tackles: { total: 18 }, dribbles: { attempts: 22, success: 14 }, rating: '7.10', position: 'Midfielder', team: { name: 'Barcelona' } }] },
    { player: { id: 19191, name: 'Marc-André ter Stegen', photo: 'https://media.api-sports.io/football/players/19191.png', nationality: 'Germany', age: 31 }, statistics: [{ games: { appearences: 36, minutes: 3240 }, goals: { total: 0, assists: 0 }, cards: { yellow: 1, red: 0 }, shots: { total: 0, on: 0 }, passes: { total: 1240, accuracy: 82 }, tackles: { total: 2 }, dribbles: { attempts: 0, success: 0 }, rating: '7.28', position: 'Goalkeeper', team: { name: 'Barcelona' } }] },
    { player: { id: 48, name: 'Ronald Araujo', photo: 'https://media.api-sports.io/football/players/48.png', nationality: 'Uruguay', age: 24 }, statistics: [{ games: { appearences: 22, minutes: 1890 }, goals: { total: 2, assists: 1 }, cards: { yellow: 5, red: 1 }, shots: { total: 14, on: 7 }, passes: { total: 980, accuracy: 87 }, tackles: { total: 62 }, dribbles: { attempts: 8, success: 5 }, rating: '7.15', position: 'Defender', team: { name: 'Barcelona' } }] },
    { player: { id: 18957, name: 'Frenkie de Jong', photo: 'https://media.api-sports.io/football/players/18957.png', nationality: 'Netherlands', age: 26 }, statistics: [{ games: { appearences: 30, minutes: 2520 }, goals: { total: 3, assists: 5 }, cards: { yellow: 6, red: 0 }, shots: { total: 28, on: 12 }, passes: { total: 2140, accuracy: 90 }, tackles: { total: 45 }, dribbles: { attempts: 78, success: 55 }, rating: '7.40', position: 'Midfielder', team: { name: 'Barcelona' } }] },
    { player: { id: 284, name: 'João Cancelo', photo: 'https://media.api-sports.io/football/players/284.png', nationality: 'Portugal', age: 29 }, statistics: [{ games: { appearences: 28, minutes: 2240 }, goals: { total: 2, assists: 6 }, cards: { yellow: 7, red: 0 }, shots: { total: 22, on: 10 }, passes: { total: 1680, accuracy: 85 }, tackles: { total: 58 }, dribbles: { attempts: 48, success: 31 }, rating: '7.22', position: 'Defender', team: { name: 'Barcelona' } }] },
    { player: { id: 154, name: 'Jules Koundé', photo: 'https://media.api-sports.io/football/players/154.png', nationality: 'France', age: 25 }, statistics: [{ games: { appearences: 32, minutes: 2720 }, goals: { total: 1, assists: 3 }, cards: { yellow: 4, red: 0 }, shots: { total: 10, on: 5 }, passes: { total: 1420, accuracy: 89 }, tackles: { total: 74 }, dribbles: { attempts: 15, success: 10 }, rating: '7.30', position: 'Defender', team: { name: 'Barcelona' } }] },
    { player: { id: 1029, name: 'Ferran Torres', photo: 'https://media.api-sports.io/football/players/1029.png', nationality: 'Spain', age: 23 }, statistics: [{ games: { appearences: 35, minutes: 2100 }, goals: { total: 9, assists: 4 }, cards: { yellow: 2, red: 0 }, shots: { total: 52, on: 28 }, passes: { total: 680, accuracy: 78 }, tackles: { total: 20 }, dribbles: { attempts: 58, success: 32 }, rating: '7.05', position: 'Attacker', team: { name: 'Barcelona' } }] },
    { player: { id: 284851, name: 'Lamine Yamal', photo: 'https://media.api-sports.io/football/players/284851.png', nationality: 'Spain', age: 16 }, statistics: [{ games: { appearences: 36, minutes: 2580 }, goals: { total: 6, assists: 9 }, cards: { yellow: 2, red: 0 }, shots: { total: 48, on: 22 }, passes: { total: 840, accuracy: 80 }, tackles: { total: 15 }, dribbles: { attempts: 120, success: 72 }, rating: '7.62', position: 'Attacker', team: { name: 'Barcelona' } }] },
    { player: { id: 889, name: 'Raphinha', photo: 'https://media.api-sports.io/football/players/889.png', nationality: 'Brazil', age: 27 }, statistics: [{ games: { appearences: 38, minutes: 2890 }, goals: { total: 10, assists: 12 }, cards: { yellow: 4, red: 0 }, shots: { total: 72, on: 36 }, passes: { total: 1020, accuracy: 82 }, tackles: { total: 28 }, dribbles: { attempts: 98, success: 55 }, rating: '7.44', position: 'Attacker', team: { name: 'Barcelona' } }] },
    { player: { id: 667, name: 'Ilkay Gündogan', photo: 'https://media.api-sports.io/football/players/667.png', nationality: 'Germany', age: 33 }, statistics: [{ games: { appearences: 34, minutes: 2650 }, goals: { total: 7, assists: 8 }, cards: { yellow: 5, red: 0 }, shots: { total: 55, on: 28 }, passes: { total: 1980, accuracy: 91 }, tackles: { total: 38 }, dribbles: { attempts: 35, success: 22 }, rating: '7.35', position: 'Midfielder', team: { name: 'Barcelona' } }] },
  ],
}

/**
 * Checks if API key is placeholder - used to decide whether to use mock data
 */
export const isApiKeyConfigured = () => {
  const key = import.meta.env.VITE_RAPIDAPI_KEY
  return key && key !== 'YOUR_RAPIDAPI_KEY_HERE' && key.length > 10
}