import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addFavoritePlayer,
  removeFavoritePlayer,
  addFavoriteMatch,
  removeFavoriteMatch,
} from '../redux/favoritesSlice'
import { showNotification } from '../redux/slices/uiSlice'

/**
 * Debounces a value by the given delay
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

/**
 * Handles favoriting/unfavoriting players with toast notification
 */
export function useFavoritePlayer(playerData) {
  const dispatch = useDispatch()
  const favPlayers = useSelector((state) => state.favorites.players)
  const isFavorite = favPlayers.some((p) => p.player.id === playerData?.player?.id)

  const toggle = useCallback(() => {
    if (!playerData) return
    if (isFavorite) {
      dispatch(removeFavoritePlayer(playerData.player.id))
      dispatch(showNotification({ type: 'info', message: `${playerData.player.name} removed from favorites` }))
    } else {
      dispatch(addFavoritePlayer(playerData))
      dispatch(showNotification({ type: 'success', message: `${playerData.player.name} added to favorites!` }))
    }
  }, [dispatch, isFavorite, playerData])

  return { isFavorite, toggle }
}

/**
 * Handles favoriting/unfavoriting matches with toast notification
 */
export function useFavoriteMatch(matchData) {
  const dispatch = useDispatch()
  const favMatches = useSelector((state) => state.favorites.matches)
  const isFavorite = favMatches.some((m) => m.fixture.id === matchData?.fixture?.id)

  const toggle = useCallback(() => {
    if (!matchData) return
    const homeTeam = matchData.teams.home.name
    const awayTeam = matchData.teams.away.name
    if (isFavorite) {
      dispatch(removeFavoriteMatch(matchData.fixture.id))
      dispatch(showNotification({ type: 'info', message: `Match removed from favorites` }))
    } else {
      dispatch(addFavoriteMatch(matchData))
      dispatch(showNotification({ type: 'success', message: `${homeTeam} vs ${awayTeam} added to favorites!` }))
    }
  }, [dispatch, isFavorite, matchData])

  return { isFavorite, toggle }
}