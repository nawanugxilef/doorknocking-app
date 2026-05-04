/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2d5a27',
          light: '#e8f0e6',
          dark: '#1e3d1a',
        },
      },
    },
  },
  plugins: [],
}
