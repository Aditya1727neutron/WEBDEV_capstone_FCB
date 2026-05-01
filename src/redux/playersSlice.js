import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchSquad, MOCK_PLAYERS } from '../services/footballApi'

export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async (_, { rejectWithValue }) => {
    try {
      const players = await fetchSquad()
      if (players && players.length > 0) {
        return players
      }
      return MOCK_PLAYERS
    } catch (error) {
      console.warn('API fetch failed for players, using mock data:', error.message)
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  items: [],
  loading: false,
  error: null,
  usingMockData: false,
}

const playersSlice = createSlice({
  name: 'players',
  initialState,
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
        state.usingMockData = false
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch players'
        state.items = MOCK_PLAYERS
        state.usingMockData = true
      })
  },
})

export const { clearPlayersError } = playersSlice.actions
export default playersSlice.reducer
