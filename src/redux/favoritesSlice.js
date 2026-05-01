import { createSlice } from '@reduxjs/toolkit'

// ─── localStorage helpers ───────────────────────────────────────────────────
const loadIds = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveIds = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

// ─── Slice ──────────────────────────────────────────────────────────────────
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    matchIds: loadIds('barca_fav_match_ids'),
    playerIds: loadIds('barca_fav_player_ids'),
  },
  reducers: {
    toggleFavoriteMatch(state, action) {
      const id = action.payload
      const idx = state.matchIds.indexOf(id)
      if (idx === -1) {
        state.matchIds.push(id)
      } else {
        state.matchIds.splice(idx, 1)
      }
      saveIds('barca_fav_match_ids', state.matchIds)
    },
    toggleFavoritePlayer(state, action) {
      const id = action.payload
      const idx = state.playerIds.indexOf(id)
      if (idx === -1) {
        state.playerIds.push(id)
      } else {
        state.playerIds.splice(idx, 1)
      }
      saveIds('barca_fav_player_ids', state.playerIds)
    },
    clearAllFavorites(state) {
      state.matchIds = []
      state.playerIds = []
      saveIds('barca_fav_match_ids', [])
      saveIds('barca_fav_player_ids', [])
    },
  },
})

export const { toggleFavoriteMatch, toggleFavoritePlayer, clearAllFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer