/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        'cyan': {
          400: '#0ff',
          500: '#00d7ff',
          800: '#005766',
        },
        'magenta': {
          400: '#ff00ff',
          500: '#f0f',
        },
        'green': {
          300: '#90ee90',
          400: '#50fa7b',
          500: '#0f0',
          700: '#006400',
          900: '#033a16',
        },
        'yellow': {
          400: '#ffff00',
        },
      },
      animation: {
        'scan': 'scanline 10s linear infinite',
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 255, 255, 0.5)',
        'neon-magenta': '0 0 10px rgba(255, 0, 255, 0.5)',
        'neon-green': '0 0 10px rgba(0, 255, 0, 0.5)',
      },
    },
  },
  plugins: [],
};