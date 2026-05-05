/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2d5a27',
          light:   '#e8f0e6',
          dark:    '#1e3d1a',
        },
      },
    },
  },
  plugins: [],
}
