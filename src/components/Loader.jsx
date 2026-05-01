import React from 'react'

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Barça spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-barca-blue/20 dark:border-barca-blue/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-barca-red border-r-barca-blue dark:border-t-barca-blue dark:border-r-barca-red animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-barca-red to-barca-gold dark:from-barca-blue dark:to-barca-red animate-pulse-glow"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-barca-away-text-muted dark:text-gray-400 tracking-wide">
            Loading
          </span>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-barca-red dark:bg-barca-blue animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-barca-gold dark:bg-barca-red animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-barca-red-light dark:bg-barca-gold animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Loader
