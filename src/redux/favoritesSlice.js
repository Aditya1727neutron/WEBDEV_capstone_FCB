import { createSlice } from '@reduxjs/toolkit'

// Load favorites from localStorage on boot
const loadFromStorage = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    players: loadFromStorage('barca_fav_players'), // Array of player objects
    matches: loadFromStorage('barca_fav_matches'), // Array of match objects
  },
  reducers: {
    // Add a favorite player
    addFavoritePlayer(state, action) {
      const exists = state.players.find((p) => p.player.id === action.payload.player.id)
      if (!exists) {
        state.players.push(action.payload)
        saveToStorage('barca_fav_players', state.players)
      }
    },
    // Remove a favorite player
    removeFavoritePlayer(state, action) {
      state.players = state.players.filter((p) => p.player.id !== action.payload)
      saveToStorage('barca_fav_players', state.players)
    },
    // Add a favorite match
    addFavoriteMatch(state, action) {
      const exists = state.matches.find((m) => m.fixture.id === action.payload.fixture.id)
      if (!exists) {
        state.matches.push(action.payload)
        saveToStorage('barca_fav_matches', state.matches)
      }
    },
    // Remove a favorite match
    removeFavoriteMatch(state, action) {
      state.matches = state.matches.filter((m) => m.fixture.id !== action.payload)
      saveToStorage('barca_fav_matches', state.matches)
    },
  },
})

export const {
  addFavoritePlayer,
  removeFavoritePlayer,
  addFavoriteMatch,
  removeFavoriteMatch,
} = favoritesSlice.actions
export default favoritesSlice.reducer