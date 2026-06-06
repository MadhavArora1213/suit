/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          black: '#111111',
          dark: '#1E1E1E',
        },
        secondary: {
          ivory: '#FAF9F6',
          beige: '#EBDDD0',
          bronze: '#BCA58A',
          light: '#686868',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Segoe UI', 'Tahoma', 'sans-serif'],
      },
      fontSize: {
        display: ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h1: ['3.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        h2: ['2.5rem', { lineHeight: '1.3', letterSpacing: '-0.005em' }],
        h3: ['1.875rem', { lineHeight: '1.4' }],
      },
      spacing: {
        gutter: '2rem',
        section: '5rem',
      },
      boxShadow: {
        premium: '0 20px 60px rgba(0,0,0,0.15)',
        'premium-lg': '0 40px 100px rgba(0,0,0,0.2)',
        glass: 'inset 0 1px 0 rgba(255,255,255,0.2)',
      },
      backdropBlur: {
        glass: '10px',
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-in-out',
        slideUp: 'slideUp 0.8s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
