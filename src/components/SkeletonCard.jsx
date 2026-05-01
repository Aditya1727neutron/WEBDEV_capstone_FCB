import React from 'react'

/**
 * Skeleton loading card with shimmer animation.
 * Provides visual feedback while data is loading.
 *
 * @param {{ variant: 'match' | 'player' | 'stat' }} props
 */
function SkeletonCard({ variant = 'match' }) {
  const shimmer = 'animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent bg-[length:200%_100%]'

  if (variant === 'stat') {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className={`w-10 h-10 rounded-lg bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer} mb-3`} />
        <div className={`h-8 w-20 rounded-lg bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer} mb-2`} />
        <div className={`h-4 w-24 rounded bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer}`} />
      </div>
    )
  }

  if (variant === 'player') {
    return (
      <div className="glass-card p-5 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer}`} />
            <div className={`w-14 h-6 rounded-lg bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer}`} />
          </div>
          <div className={`w-8 h-8 rounded-lg bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer}`} />
        </div>
        <div className={`h-5 w-32 rounded bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer} mb-2`} />
        <div className={`h-4 w-24 rounded bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer} mb-4`} />
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-barca-dark-border dark:border-barca-dark-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className={`h-6 w-8 mx-auto rounded bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer} mb-1`} />
              <div className={`h-3 w-10 mx-auto rounded bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer}`} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Default: match card skeleton
  return (
    <div className="glass-card p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className={`h-6 w-24 rounded-lg bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer}`} />
        <div className={`h-6 w-6 rounded bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer}`} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-12 h-12 rounded-xl bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer} mb-2`} />
          <div className={`h-4 w-16 rounded bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer}`} />
        </div>
        <div className="flex flex-col items-center px-4">
          <div className={`h-8 w-16 rounded bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer}`} />
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-12 h-12 rounded-xl bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer} mb-2`} />
          <div className={`h-4 w-16 rounded bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer}`} />
        </div>
      </div>
      <div className={`mt-4 pt-3 border-t border-barca-dark-border`}>
        <div className={`h-3 w-28 mx-auto rounded bg-barca-dark-card dark:bg-barca-dark-hover ${shimmer}`} />
      </div>
    </div>
  )
}

export default React.memo(SkeletonCard)
