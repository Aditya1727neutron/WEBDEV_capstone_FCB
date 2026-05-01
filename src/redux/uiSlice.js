import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  darkMode: JSON.parse(localStorage.getItem('barca_darkMode') || 'true'),
  sidebarOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDarkMode(state, action) {
      state.darkMode = action.payload
      localStorage.setItem('barca_darkMode', JSON.stringify(action.payload))
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode
      localStorage.setItem('barca_darkMode', JSON.stringify(state.darkMode))
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
  },
})

export const { setDarkMode, toggleDarkMode, setSidebarOpen, toggleSidebar } = uiSlice.actions
export default uiSlice.reducer
