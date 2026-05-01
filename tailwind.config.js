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
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0, 77, 152, 0.4)',
        'glow-red': '0 0 20px rgba(165, 0, 68, 0.4)',
        'glow-gold': '0 0 20px rgba(237, 187, 0, 0.3)',
        'card-dark': '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(26, 45, 90, 0.3)',
        'card-light': '0 8px 32px rgba(92, 26, 0, 0.08), 0 0 0 1px rgba(240, 208, 112, 0.3)',
        'premium': '0 20px 60px -12px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scale-in': 'scaleIn 0.3s ease-out',
        'count-up': 'countUp 0.6s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 77, 152, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 77, 152, 0.6), 0 0 40px rgba(165, 0, 68, 0.3)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
