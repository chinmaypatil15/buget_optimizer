/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          500: '#1d63ed',
          600: '#154ec4',
          700: '#0e3aa0'
        }
      }
    },
  },
  plugins: [],
}
