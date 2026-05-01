import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getBarcelonaMatches } from '../services/footballApi'

/**
 * Async thunk: Fetch all Barcelona matches from API-Football.
 * Uses REAL API data — no mock/dummy arrays.
 */
export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async (season = 2024, { rejectWithValue }) => {
    try {
      const matches = await getBarcelonaMatches(season)
      return matches
    } catch (error) {
      const msg =
        error.response?.status === 429
          ? 'API rate limit exceeded. Please wait a moment and try again.'
          : error.response?.status === 401
          ? 'Invalid API key. Check your VITE_API_KEY in .env'
          : error.message || 'Failed to fetch matches'
      return rejectWithValue(msg)
    }
  }
)

const matchesSlice = createSlice({
  name: 'matches',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMatchesError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch matches'
      })
  },
})

export const { clearMatchesError } = matchesSlice.actions
export default matchesSlice.reducer