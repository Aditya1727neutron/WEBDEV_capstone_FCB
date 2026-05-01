import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setDarkMode } from './redux/uiSlice'
import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Loader from './components/Loader'

// Lazy load pages for performance optimization
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Matches = lazy(() => import('./pages/Matches'))
const MatchDetail = lazy(() => import('./pages/MatchDetail'))
const Players = lazy(() => import('./pages/Players'))
const Favorites = lazy(() => import('./pages/Favorites'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  const dispatch = useDispatch()
  const { darkMode } = useSelector((state) => state.ui)

  // Apply dark/light class to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Load dark mode preference from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('barca_darkMode')
    if (saved !== null) {
      dispatch(setDarkMode(JSON.parse(saved)))
    }
  }, [dispatch])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className={`min-h-screen flex flex-col relative overflow-hidden
          ${darkMode ? 'bg-barca-dark' : 'bg-barca-away-bg'}`}>

          {/* Animated background orbs */}
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />

          <Navbar />
          <div className="flex flex-1 pt-16">
            <Sidebar />
            <main className="flex-1 ml-0 lg:ml-64 min-h-screen relative z-10">
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/matches" element={<Matches />} />
                  <Route path="/match/:id" element={<MatchDetail />} />
                  <Route path="/players" element={<Players />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App