import { useEffect, useRef, useCallback, useState } from 'react'

/**
 * Custom hook for auto-refreshing data at a specified interval.
 * Provides manual refresh trigger and countdown timer.
 *
 * @param {Function} refreshFn - The function to call on each refresh
 * @param {number} intervalMs - Refresh interval in milliseconds (default: 60000 = 1 min)
 * @param {boolean} enabled - Whether auto-refresh is enabled (default: true)
 * @returns {{ lastRefreshed: Date|null, secondsUntilRefresh: number, refresh: Function, isRefreshing: boolean }}
 */
export function useAutoRefresh(refreshFn, intervalMs = 60000, enabled = true) {
  const [lastRefreshed, setLastRefreshed] = useState(null)
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(Math.floor(intervalMs / 1000))
  const [isRefreshing, setIsRefreshing] = useState(false)
  const intervalRef = useRef(null)
  const countdownRef = useRef(null)

  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await refreshFn()
      setLastRefreshed(new Date())
      setSecondsUntilRefresh(Math.floor(intervalMs / 1000))
    } finally {
      setIsRefreshing(false)
    }
  }, [refreshFn, intervalMs])

  useEffect(() => {
    if (!enabled) return

    // Set initial timestamp
    setLastRefreshed(new Date())

    // Auto-refresh interval
    intervalRef.current = setInterval(() => {
      refresh()
    }, intervalMs)

    // Countdown timer (updates every second)
    countdownRef.current = setInterval(() => {
      setSecondsUntilRefresh((prev) => (prev <= 1 ? Math.floor(intervalMs / 1000) : prev - 1))
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [enabled, intervalMs, refresh])

  return { lastRefreshed, secondsUntilRefresh, refresh, isRefreshing }
}
