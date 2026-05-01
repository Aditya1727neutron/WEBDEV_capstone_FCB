import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: true, // Barcelona theme default is dark
    sidebarOpen: false, // Mobile sidebar toggle
    globalLoading: false,
    notification: null, // { type: 'success'|'error'|'info', message: '' }
  },
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
    setGlobalLoading(state, action) {
      state.globalLoading = action.payload
    },
    showNotification(state, action) {
      state.notification = action.payload
    },
    clearNotification(state) {
      state.notification = null
    },
  },
})

export const {
  setDarkMode,
  toggleDarkMode,
  setSidebarOpen,
  toggleSidebar,
  setGlobalLoading,
  showNotification,
  clearNotification,
} = uiSlice.actions
export default uiSlice.reducer