import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleDarkMode, toggleSidebar } from '../redux/uiSlice'

function Navbar() {
  const dispatch = useDispatch()
  const { darkMode } = useSelector((state) => state.ui)

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-xl border-b
      ${darkMode
        ? 'bg-barca-dark-surface/95 border-barca-dark-border'
        : 'bg-barca-away-card/95 border-barca-away-border'
      }`}>
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left — Hamburger + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            id="sidebar-toggle"
            onClick={() => dispatch(toggleSidebar())}
            className={`lg:hidden p-2 rounded-lg transition-colors
              ${darkMode ? 'hover:bg-barca-dark-card' : 'hover:bg-barca-away-surface'}`}
            aria-label="Toggle sidebar"
          >
            <svg className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-barca-away-text'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm font-heading">FCB</span>
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg font-bold font-heading leading-none
                ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>
                FC Barcelona
              </h1>
              <p className={`text-xs leading-none mt-0.5
                ${darkMode ? 'text-barca-blue-light' : 'text-barca-red'}`}>
                Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Right — Dark mode toggle */}
        <div className="flex items-center gap-2">
          {/* Mode label */}
          <span className={`hidden sm:inline text-xs font-semibold mr-1
            ${darkMode ? 'text-barca-blue-light' : 'text-barca-red'}`}>
            {darkMode ? '🏠 Home Kit' : '✈️ Away Kit'}
          </span>

          <button
            id="dark-mode-toggle"
            onClick={() => dispatch(toggleDarkMode())}
            className={`relative p-2.5 rounded-xl transition-all duration-300 group
              ${darkMode
                ? 'hover:bg-barca-dark-card'
                : 'hover:bg-barca-away-surface'
              }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              /* Sun icon — switch to Away Kit (light) */
              <svg className="w-5 h-5 text-barca-gold transition-transform duration-300 group-hover:rotate-45" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              /* Moon icon — switch to Home Kit (dark) */
              <svg className="w-5 h-5 text-barca-red transition-transform duration-300 group-hover:-rotate-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
