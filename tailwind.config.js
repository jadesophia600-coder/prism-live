/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#070a14',
          900: '#0e1526',
          800: '#1e293b'
        }
      }
    },
  },
  plugins: [],
}
