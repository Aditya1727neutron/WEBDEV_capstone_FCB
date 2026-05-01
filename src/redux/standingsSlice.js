import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchStandings as fetchStandingsApi } from '../services/footballApi'

const BARCA_TEAM_ID = 81

/**
 * Mock standings data — used when API fails or is rate-limited.
 */
const MOCK_STANDINGS = [
  { position: 1, team: { id: 81, name: 'FC Barcelona', shortName: 'Barça', crest: '' }, playedGames: 30, won: 24, draw: 3, lost: 3, points: 75, goalsFor: 72, goalsAgainst: 22, goalDifference: 50 },
  { position: 2, team: { id: 86, name: 'Real Madrid CF', shortName: 'Real Madrid', crest: '' }, playedGames: 30, won: 22, draw: 5, lost: 3, points: 71, goalsFor: 65, goalsAgainst: 24, goalDifference: 41 },
  { position: 3, team: { id: 78, name: 'Club Atlético de Madrid', shortName: 'Atlético', crest: '' }, playedGames: 30, won: 20, draw: 6, lost: 4, points: 66, goalsFor: 55, goalsAgainst: 28, goalDifference: 27 },
  { position: 4, team: { id: 77, name: 'Athletic Club', shortName: 'Athletic', crest: '' }, playedGames: 30, won: 16, draw: 7, lost: 7, points: 55, goalsFor: 48, goalsAgainst: 32, goalDifference: 16 },
  { position: 5, team: { id: 94, name: 'Villarreal CF', shortName: 'Villarreal', crest: '' }, playedGames: 30, won: 14, draw: 8, lost: 8, points: 50, goalsFor: 52, goalsAgainst: 40, goalDifference: 12 },
]

export const fetchStandingsData = createAsyncThunk(
  'standings/fetchStandings',
  async (_, { rejectWithValue }) => {
    try {
      const standings = await fetchStandingsApi()
      if (standings && standings.length > 0) {
        const totalTable = standings.find((s) => s.type === 'TOTAL')
        if (totalTable && totalTable.table) {
          return totalTable.table.slice(0, 20) // top 20
        }
      }
      return MOCK_STANDINGS
    } catch (error) {
      console.warn('Standings API failed, using mock data:', error.message)
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  items: [],
  barcaPosition: null,
  loading: false,
  error: null,
  usingMockData: false,
}

const standingsSlice = createSlice({
  name: 'standings',
  initialState,
  reducers: {
    clearStandingsError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStandingsData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStandingsData.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.barcaPosition = action.payload.find((row) => row.team.id === BARCA_TEAM_ID) || null
        state.usingMockData = false
      })
      .addCase(fetchStandingsData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch standings'
        state.items = MOCK_STANDINGS
        state.barcaPosition = MOCK_STANDINGS.find((row) => row.team.id === BARCA_TEAM_ID) || null
        state.usingMockData = true
      })
  },
})

export const { clearStandingsError } = standingsSlice.actions
export default standingsSlice.reducer
