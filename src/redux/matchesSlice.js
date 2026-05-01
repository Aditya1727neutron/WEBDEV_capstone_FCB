import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { footballApi } from '../../services/footballApi'

// Async thunk to fetch all fixtures for Barcelona
export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async ({ season = 2023 } = {}, { rejectWithValue }) => {
    try {
      const response = await footballApi.getFixtures({ team: 529, season })
      return response.data.response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch matches')
    }
  }
)

// Async thunk to fetch a single match by fixture ID
export const fetchMatchById = createAsyncThunk(
  'matches/fetchMatchById',
  async (fixtureId, { rejectWithValue }) => {
    try {
      const [fixtureRes, statsRes] = await Promise.all([
        footballApi.getFixtures({ id: fixtureId }),
        footballApi.getFixtureStats(fixtureId),
      ])
      return {
        fixture: fixtureRes.data.response[0],
        stats: statsRes.data.response,
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch match details')
    }
  }
)

const matchesSlice = createSlice({
  name: 'matches',
  initialState: {
    list: [],           // All fixtures
    currentMatch: null, // Selected match detail
    loading: false,
    detailLoading: false,
    error: null,
    detailError: null,
    activeCompetition: 'All', // Filter state
    currentPage: 1,
    itemsPerPage: 10,
  },
  reducers: {
    setActiveCompetition(state, action) {
      state.activeCompetition = action.payload
      state.currentPage = 1
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload
    },
    clearCurrentMatch(state) {
      state.currentMatch = null
      state.detailError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all matches
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch single match
      .addCase(fetchMatchById.pending, (state) => {
        state.detailLoading = true
        state.detailError = null
      })
      .addCase(fetchMatchById.fulfilled, (state, action) => {
        state.detailLoading = false
        state.currentMatch = action.payload
      })
      .addCase(fetchMatchById.rejected, (state, action) => {
        state.detailLoading = false
        state.detailError = action.payload
      })
  },
})

export const { setActiveCompetition, setCurrentPage, clearCurrentMatch } = matchesSlice.actions
export default matchesSlice.reducer