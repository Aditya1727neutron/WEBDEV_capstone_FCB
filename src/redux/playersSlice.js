import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { footballApi } from '../../services/footballApi'

// Fetch all players for Barcelona (handles pagination internally)
export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async ({ season = 2023, page = 1 } = {}, { rejectWithValue }) => {
    try {
      const response = await footballApi.getPlayers({ team: 529, season, page })
      return {
        players: response.data.response,
        paging: response.data.paging,
        page,
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch players')
    }
  }
)

// Fetch all pages of players
export const fetchAllPlayers = createAsyncThunk(
  'players/fetchAllPlayers',
  async ({ season = 2023 } = {}, { rejectWithValue }) => {
    try {
      // Get first page to know total pages
      const first = await footballApi.getPlayers({ team: 529, season, page: 1 })
      const { pages } = first.data.paging
      let allPlayers = [...first.data.response]

      // Fetch remaining pages in parallel
      if (pages > 1) {
        const requests = Array.from({ length: pages - 1 }, (_, i) =>
          footballApi.getPlayers({ team: 529, season, page: i + 2 })
        )
        const results = await Promise.all(requests)
        results.forEach((r) => {
          allPlayers = [...allPlayers, ...r.data.response]
        })
      }

      return allPlayers
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all players')
    }
  }
)

const playersSlice = createSlice({
  name: 'players',
  initialState: {
    list: [],
    loading: false,
    error: null,
    searchQuery: '',
    positionFilter: 'All',
    sortBy: 'goals', // goals | assists | appearances
    // Player comparison
    comparedPlayers: [], // max 2 player IDs
  },
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload
    },
    setPositionFilter(state, action) {
      state.positionFilter = action.payload
    },
    setSortBy(state, action) {
      state.sortBy = action.payload
    },
    addToComparison(state, action) {
      const id = action.payload
      if (!state.comparedPlayers.includes(id) && state.comparedPlayers.length < 2) {
        state.comparedPlayers.push(id)
      }
    },
    removeFromComparison(state, action) {
      state.comparedPlayers = state.comparedPlayers.filter((p) => p !== action.payload)
    },
    clearComparison(state) {
      state.comparedPlayers = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPlayers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllPlayers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchAllPlayers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  setSearchQuery,
  setPositionFilter,
  setSortBy,
  addToComparison,
  removeFromComparison,
  clearComparison,
} = playersSlice.actions
export default playersSlice.reducer