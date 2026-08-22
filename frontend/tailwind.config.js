/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1B2A4A',
          light: '#2C4270',
          soft: '#3F5688',
        },
        paper: {
          DEFAULT: '#F1EAD9',
          dark: '#E4D9BF',
        },
        stamp: {
          DEFAULT: '#A63D40',
          dark: '#82302F',
        },
        brass: {
          DEFAULT: '#C08A28',
          light: '#DDB05B',
        },
        route: '#2F6E5E',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Work Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(27,42,74,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
}
