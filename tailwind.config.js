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
        dark: {
          DEFAULT: '#1a1a1a',
          lighter: '#262626',
          grid: '#333333',
          text: '#e0e0e0'
        }
      }
    },
  },
  plugins: [],
}
