/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f0efe9',
        olive: '#3a4a16',
        'olive-deep': '#212e02',
      },
      fontFamily: {
        'display': ['Instrument Serif', 'Georgia', 'serif'],
        'geist': ['Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'taviraj': ['Taviraj', 'Georgia', 'serif'],
        'pressstart2p': ['PressStart2P', 'monospace'],
        'pixellari': ['Pixellari', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
} 