/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#0C0C0E',
          mid: '#141418',
          soft: '#1C1C22',
        },
        ivory: {
          DEFAULT: '#FAF7F2',
          soft: '#F2EDE6',
          dim: '#E8E0D5',
        },
        gold: {
          DEFAULT: '#C9A96E',
          light: '#DEC08A',
          dark: '#A8863E',
        },
        crimson: '#8B1A3A',
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", 'serif'],
        body: ["'DM Sans'", 'sans-serif'],
        script: ["'Great Vibes'", 'cursive'],
      },
      boxShadow: {
        premium: '0 20px 60px rgba(0,0,0,0.25)',
        'premium-lg': '0 40px 100px rgba(0,0,0,0.35)',
        gold: '0 0 40px rgba(201,169,110,0.15)',
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-in-out',
        slideUp: 'slideUp 0.8s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(30px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
      },
    },
  },
  plugins: [],
}
