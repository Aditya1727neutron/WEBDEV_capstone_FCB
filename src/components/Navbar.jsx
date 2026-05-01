import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleDarkMode, toggleSidebar } from '../redux/uiSlice'

function Navbar() {
  const dispatch = useDispatch()
  const { darkMode } = useSelector((state) => state.ui)
  const [scrolled, setScrolled] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Track scroll for navbar shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const handleToggleDark = useCallback(() => dispatch(toggleDarkMode()), [dispatch])
  const handleToggleSidebar = useCallback(() => dispatch(toggleSidebar()), [dispatch])

  const timeStr = currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 navbar-blur border-b transition-all duration-300
      ${darkMode
        ? 'bg-barca-dark-surface/90 border-barca-dark-border'
        : 'bg-barca-away-card/90 border-barca-away-border'
      }
      ${scrolled ? (darkMode ? 'shadow-lg shadow-black/20' : 'shadow-lg shadow-black/5') : ''}
    `}>
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left — Hamburger + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            id="sidebar-toggle"
            onClick={handleToggleSidebar}
            className={`lg:hidden p-2 rounded-xl transition-all duration-200 active:scale-90
              ${darkMode ? 'hover:bg-barca-dark-card text-gray-300' : 'hover:bg-barca-away-surface text-barca-away-text'}`}
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg animate-glow relative overflow-hidden">
              <span className="text-white font-bold text-sm font-heading relative z-10">FCB</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg font-bold font-heading leading-none
                ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>
                FC Barcelona
              </h1>
              <p className={`text-[11px] leading-none mt-0.5 font-medium
                ${darkMode ? 'text-barca-blue-light' : 'text-barca-red'}`}>
                Sports Analytics Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Right — Clock, Mode toggle */}
        <div className="flex items-center gap-3">
          {/* Live clock */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono
            ${darkMode ? 'bg-barca-dark-card text-gray-400 border border-barca-dark-border' : 'bg-barca-away-surface text-barca-away-text-muted border border-barca-away-border'}`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${darkMode ? 'bg-green-400' : 'bg-green-500'}`} />
            {timeStr}
          </div>

          {/* Mode label */}
          <span className={`hidden sm:inline text-xs font-semibold
            ${darkMode ? 'text-barca-blue-light' : 'text-barca-red'}`}>
            {darkMode ? '🏠 Home' : '✈️ Away'}
          </span>

          {/* Dark mode toggle */}
          <button
            id="dark-mode-toggle"
            onClick={handleToggleDark}
            className={`relative p-2.5 rounded-xl transition-all duration-300 group mode-toggle
              ${darkMode
                ? 'hover:bg-barca-dark-card'
                : 'hover:bg-barca-away-surface'
              }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-5 h-5 text-barca-gold transition-transform duration-500 group-hover:rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-barca-red transition-transform duration-500 group-hover:-rotate-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default React.memo(Navbar)
