import { createSlice } from '@reduxjs/toolkit'

// Load from localStorage
function loadFavorites() {
  try {
    const saved = localStorage.getItem('barca_favorites')
    return saved ? JSON.parse(saved) : { matchIds: [], playerIds: [] }
  } catch {
    return { matchIds: [], playerIds: [] }
  }
}

function saveFavorites(state) {
  localStorage.setItem('barca_favorites', JSON.stringify({
    matchIds: state.matchIds,
    playerIds: state.playerIds,
  }))
}

const initialState = loadFavorites()

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavoriteMatch(state, action) {
      const matchId = action.payload
      const index = state.matchIds.indexOf(matchId)
      if (index === -1) {
        state.matchIds.push(matchId)
      } else {
        state.matchIds.splice(index, 1)
      }
      saveFavorites(state)
    },
    toggleFavoritePlayer(state, action) {
      const playerId = action.payload
      const index = state.playerIds.indexOf(playerId)
      if (index === -1) {
        state.playerIds.push(playerId)
      } else {
        state.playerIds.splice(index, 1)
      }
      saveFavorites(state)
    },
    clearAllFavorites(state) {
      state.matchIds = []
      state.playerIds = []
      saveFavorites(state)
    },
  },
})

export const { toggleFavoriteMatch, toggleFavoritePlayer, clearAllFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer
