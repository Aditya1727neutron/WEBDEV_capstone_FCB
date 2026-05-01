import { configureStore } from '@reduxjs/toolkit'
import matchesReducer from './slices/matchesSlice'
import playersReducer from './slices/playersSlice'
import favoritesReducer from './slices/favoritesSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    players: playersReducer,
    favorites: favoritesReducer,
    ui: uiReducer,
  },
})