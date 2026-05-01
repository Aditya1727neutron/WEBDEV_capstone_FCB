import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './uiSlice'
import matchesReducer from './matchesSlice'
import playersReducer from './playersSlice'
import favoritesReducer from './favoritesSlice'
import standingsReducer from './standingsSlice'

const store = configureStore({
  reducer: {
    ui: uiReducer,
    matches: matchesReducer,
    players: playersReducer,
    favorites: favoritesReducer,
    standings: standingsReducer,
  },
})

export default store