import { useState, useEffect } from 'react'

/**
 * Custom hook that debounces a value by a specified delay.
 * Useful for search inputs to avoid excessive API calls / re-renders.
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Debounce delay in milliseconds (default: 300ms)
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
