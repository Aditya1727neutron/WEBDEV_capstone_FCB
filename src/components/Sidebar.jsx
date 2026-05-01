import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setSidebarOpen } from '../redux/uiSlice'

const navItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5zM4 14a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3z" />
      </svg>
    ),
  },
  {
    path: '/matches',
    label: 'Matches',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    path: '/players',
    label: 'Players',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    path: '/favorites',
    label: 'Favorites',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
]

function Sidebar() {
  const dispatch = useDispatch()
  const { sidebarOpen, darkMode } = useSelector((state) => state.ui)
  const { matchIds, playerIds } = useSelector((state) => state.favorites)
  const totalFavorites = matchIds.length + playerIds.length

  const closeSidebar = () => dispatch(setSidebarOpen(false))

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64
          backdrop-blur-xl border-r transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${darkMode
            ? 'bg-barca-dark-surface/95 border-barca-dark-border'
            : 'bg-barca-away-card/95 border-barca-away-border'
          }
        `}
      >
        <div className="flex flex-col h-full p-4">
          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5 mt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive
                    ? 'gradient-bg text-white shadow-lg'
                    : darkMode
                      ? 'text-gray-400 hover:bg-barca-dark-card hover:text-white'
                      : 'text-barca-away-text-muted hover:bg-barca-away-surface hover:text-barca-away-text'
                  }`
                }
              >
                <span className="transition-transform duration-200 group-hover:scale-110">
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {/* Favorites badge */}
                {item.label === 'Favorites' && totalFavorites > 0 && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-barca-red text-white">
                    {totalFavorites}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom section — Barça motto */}
          <div className={`mt-auto pt-4 border-t ${darkMode ? 'border-barca-dark-border' : 'border-barca-away-border'}`}>
            <div className={`px-4 py-3 rounded-xl ${
              darkMode
                ? 'bg-gradient-to-br from-barca-blue/10 to-barca-red/10'
                : 'bg-gradient-to-br from-barca-red/10 to-barca-gold/10'
            }`}>
              <p className="text-xs font-semibold gradient-text">Més que un club</p>
              <p className={`text-[10px] mt-0.5 ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>
                More than a club
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
