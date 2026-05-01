/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        barca: {
          // Core brand
          blue: '#004D98',
          'blue-light': '#1a6ab5',
          'blue-dark': '#003366',
          red: '#A50044',
          'red-light': '#c4175f',
          'red-dark': '#7a0033',
          gold: '#EDBB00',
          'gold-light': '#f5d34d',
          'gold-dark': '#c49a00',

          // Dark mode (HOME KIT — Blaugrana deep blue/red)
          dark: '#070d1f',
          'dark-card': '#0f1a38',
          'dark-surface': '#0b1330',
          'dark-border': '#1a2d5a',
          'dark-hover': '#142044',

          // Light mode (AWAY KIT — Red & Gold warm tones)
          'away-bg': '#FFF7E0',
          'away-surface': '#FFF0C4',
          'away-card': '#FFFFFF',
          'away-border': '#F0D070',
          'away-hover': '#FFF3D4',
          'away-text': '#5C1A00',
          'away-text-muted': '#8B5E3C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
