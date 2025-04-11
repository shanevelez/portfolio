import scrollbar from 'tailwind-scrollbar'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
  animation: {
    'fade-in': 'fadeIn 0.3s ease-out',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: 0, transform: 'scale(0.95)' },
      '100%': { opacity: 1, transform: 'scale(1)' },
    },
  },
},
  },
  plugins: [
    scrollbar(), // ← must be called as a function
  ],
}
