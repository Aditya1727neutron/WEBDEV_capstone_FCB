import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchMatches as fetchMatchesApi, MOCK_MATCHES } from '../services/footballApi'

export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async (_, { rejectWithValue }) => {
    try {
      const matches = await fetchMatchesApi()
      if (matches && matches.length > 0) {
        return matches
      }
      // If API returns empty, use mock data
      return MOCK_MATCHES
    } catch (error) {
      console.warn('API fetch failed, using mock data:', error.message)
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

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
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
        state.usingMockData = false
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch matches'
        // Fallback to mock data on error
        state.items = MOCK_MATCHES
        state.usingMockData = true
      })
  },
})

export const { clearMatchesError } = matchesSlice.actions
export default matchesSlice.reducer
