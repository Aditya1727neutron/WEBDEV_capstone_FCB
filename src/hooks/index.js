import { useDispatch, useSelector } from 'react-redux'

/**
 * Typed dispatch hook
 */
export const useAppDispatch = () => useDispatch()

/**
 * Typed selector hook
 */
export const useAppSelector = useSelector

/**
 * Hook to check if a match is favorited
 */
export function useIsMatchFavorite(matchId) {
  return useSelector((state) => state.favorites.matchIds.includes(matchId))
}

/**
 * Hook to check if a player is favorited
 */
export function useIsPlayerFavorite(playerId) {
  return useSelector((state) => state.favorites.playerIds.includes(playerId))
}
