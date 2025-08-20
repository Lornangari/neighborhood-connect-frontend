
// module.exports = {
//   darkMode: 'class',
//   // ...
// }


/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add this so Tailwind scans your React files
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [],
}
