import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './uiSlice'
import matchesReducer from './matchesSlice'
import playersReducer from './playersSlice'
import favoritesReducer from './favoritesSlice'

const store = configureStore({
  reducer: {
    ui: uiReducer,
    matches: matchesReducer,
    players: playersReducer,
    favorites: favoritesReducer,
  },
})

export default store
