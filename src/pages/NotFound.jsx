import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function NotFound() {
  const navigate = useNavigate()
  const { darkMode } = useSelector((s) => s.ui)

  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[70vh] text-center">
      {/* Large 404 */}
      <div className="relative mb-8">
        <span className={`text-[120px] md:text-[160px] font-black font-heading leading-none select-none
          ${darkMode ? 'text-barca-dark-card' : 'text-barca-away-surface'}`}>
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center shadow-2xl animate-pulse-glow">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
        </div>
      </div>

      <h1 className={`text-2xl md:text-3xl font-bold font-heading mb-3
        ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>
        Page Not Found
      </h1>
      <p className={`text-sm max-w-md mb-8
        ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>
        The page you're looking for doesn't exist or has been moved. 
        Let's get you back to the pitch!
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}

export default NotFound
