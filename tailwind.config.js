/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'credit-sea': {
          'green': '#0A512FE8',
          'green-light': '#0A512F',
          'green-dark': '#06401F',
        }
      }
    },
  },
  plugins: [],
}
