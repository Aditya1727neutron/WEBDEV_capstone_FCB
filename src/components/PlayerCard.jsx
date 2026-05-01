import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavoritePlayer } from '../redux/favoritesSlice'
import { useIsPlayerFavorite } from '../hooks'
import { formatPosition, getPositionColor } from '../utils/matchUtils'

function PlayerCard({ player }) {
  const dispatch = useDispatch()
  const { darkMode } = useSelector(s => s.ui)
  const isFavorite = useIsPlayerFavorite(player.id)
  const handleFavorite = (e) => { e.stopPropagation(); dispatch(toggleFavoritePlayer(player.id)) }
  const age = player.dateOfBirth ? new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear() : null

  return (
    <div className="glass-card-hover p-5 group relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 gradient-bg opacity-40 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg font-heading">{player.shirtNumber || '–'}</span>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getPositionColor(player.position)}`}>
            {formatPosition(player.position)}
          </span>
        </div>
        <button onClick={handleFavorite} className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-barca-dark-card' : 'hover:bg-barca-away-surface'}`}>
          <svg className={`w-4 h-4 transition-all duration-300 ${isFavorite ? 'text-barca-red fill-current scale-110' : darkMode ? 'text-gray-400 hover:text-barca-red' : 'text-barca-away-text-muted hover:text-barca-red'}`}
            fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <h3 className={`text-base font-bold mb-1 font-heading ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{player.name}</h3>
      <div className={`flex items-center gap-2 text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-barca-away-text-muted'}`}>
        <span>{player.nationality}</span>
        {age && (<><span className={darkMode ? 'text-gray-600' : 'text-barca-away-border'}>•</span><span>{age} yrs</span></>)}
      </div>
      {player.stats && (
        <div className={`grid grid-cols-3 gap-2 pt-3 border-t ${darkMode ? 'border-barca-dark-border' : 'border-barca-away-border'}`}>
          <div className="text-center"><p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{player.stats.appearances}</p><p className={`text-[10px] uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>Apps</p></div>
          <div className="text-center"><p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{player.position === 'Goalkeeper' ? player.stats.cleanSheets : player.stats.goals}</p><p className={`text-[10px] uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>{player.position === 'Goalkeeper' ? 'CS' : 'Goals'}</p></div>
          <div className="text-center"><p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-barca-away-text'}`}>{player.stats.assists}</p><p className={`text-[10px] uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-barca-away-text-muted'}`}>Assists</p></div>
        </div>
      )}
    </div>
  )
}

export default PlayerCard
