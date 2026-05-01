import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getBarcelonaPlayers } from '../services/footballApi'

/**
 * Async thunk: Fetch all Barcelona players from API-Football.
 * Uses REAL API data — no mock/dummy arrays.
 * Handles pagination internally via the API service.
 */
export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async (season = 2024, { rejectWithValue }) => {
    try {
      const players = await getBarcelonaPlayers(season)
      return players
    } catch (error) {
      const msg =
        error.response?.status === 429
          ? 'API rate limit exceeded. Please wait a moment and try again.'
          : error.response?.status === 401
          ? 'Invalid API key. Check your VITE_API_KEY in .env'
          : error.message || 'Failed to fetch players'
      return rejectWithValue(msg)
    }
  }
)

const playersSlice = createSlice({
  name: 'players',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearPlayersError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch players'
      })
  },
})

export const { clearPlayersError } = playersSlice.actions
export default playersSlice.reducer