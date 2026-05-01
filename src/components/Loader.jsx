import React from 'react'

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Barça spinner */}
        <div className="relative w-20 h-20">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-barca-dark-border dark:border-barca-dark-border/30 light:border-barca-away-border" />
          {/* Spinning gradient ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-barca-red border-r-barca-blue dark:border-t-barca-blue dark:border-r-barca-red animate-spin" />
          {/* Inner pulsing core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg animate-pulse-glow">
              <span className="text-white font-bold text-xs font-heading">FCB</span>
            </div>
          </div>
        </div>

        {/* Loading text with bouncing dots */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-barca-away-text-muted dark:text-gray-400 tracking-wide">
            Loading
          </span>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-barca-red dark:bg-barca-blue animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-barca-gold dark:bg-barca-red animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-barca-red-light dark:bg-barca-gold animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Loader)
