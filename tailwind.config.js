/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Pastel palette
        pastel: {
          50: '#f7f9fc',
          100: '#eef2f8',
          200: '#dde6f0',
          300: '#c9d6e5',
          400: '#a8bdd3',
          500: '#8aa1bf',
        },
        mint: {
          50: '#f0faf6',
          100: '#dcf3e8',
          200: '#b9e6d2',
          300: '#8dd4b6',
          400: '#5cbd94',
          500: '#3da677',
          600: '#2d8a62',
        },
        sky: {
          50: '#f0f7fd',
          100: '#dbeefb',
          200: '#b8dcf7',
          300: '#8bc4ef',
          400: '#5ea7e0',
          500: '#3d8bca',
          600: '#2c6da8',
        },
        peach: {
          50: '#fef7f3',
          100: '#fdeee3',
          200: '#fad9c6',
          300: '#f6bda0',
          400: '#f09a72',
          500: '#e87a52',
        },
        lavender: {
          50: '#f6f4fc',
          100: '#ebe6f6',
          200: '#d6cced',
          300: '#bba8de',
          400: '#9d83ca',
          500: '#8266b5',
        },
        rose: {
          50: '#fdf5f6',
          100: '#fbe9ec',
          200: '#f6d2d8',
          300: '#eeb0bb',
          400: '#e28898',
          500: '#d06a7d',
        },
        amber: {
          50: '#fefaf3',
          100: '#fcf0db',
          200: '#f8dfb6',
          300: '#f2c885',
          400: '#eab05a',
          500: '#d99a3d',
        },
      },
    },
  },
  plugins: [],
};
