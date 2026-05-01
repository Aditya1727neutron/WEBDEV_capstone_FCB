import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getStandings, BARCA_TEAM_ID } from '../services/footballApi'

/**
 * Async thunk: Fetch La Liga standings from API-Football.
 * Extracts Barcelona's position from the full table.
 */
export const fetchStandingsData = createAsyncThunk(
  'standings/fetchStandingsData',
  async (season = 2024, { rejectWithValue }) => {
    try {
      const standings = await getStandings(season)
      return standings
    } catch (error) {
      const msg = error.message || 'Failed to fetch standings'
      return rejectWithValue(msg)
    }
  }
)

const standingsSlice = createSlice({
  name: 'standings',
  initialState: {
    table: [],
    barcaPosition: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStandingsData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStandingsData.fulfilled, (state, action) => {
        state.loading = false
        state.table = action.payload

        // Find Barcelona in the standings table
        const barca = action.payload.find(
          (entry) => entry.team?.id === BARCA_TEAM_ID
        )
        if (barca) {
          state.barcaPosition = {
            position: barca.rank,
            points: barca.points,
            played: barca.all?.played ?? 0,
            won: barca.all?.win ?? 0,
            draw: barca.all?.draw ?? 0,
            lost: barca.all?.lose ?? 0,
            goalsFor: barca.all?.goals?.for ?? 0,
            goalsAgainst: barca.all?.goals?.against ?? 0,
            goalDifference: barca.goalsDiff ?? 0,
            form: barca.form || '',
          }
        }
      })
      .addCase(fetchStandingsData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch standings'
      })
  },
})

export default standingsSlice.reducer
