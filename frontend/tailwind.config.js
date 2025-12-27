/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Modern Teal/Aqua Theme */
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',  /* Accent teal */
          600: '#0d9488',
          700: '#0f766e',  /* Deep teal */
          800: '#115e59',
          900: '#134e4a'
        },
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          DEFAULT: '#14b8a6',  /* Primary teal */
          600: '#0d9488',
          700: '#0f766e',      /* Deep teal accent */
          800: '#115e59',
          900: '#134e4a'
        },
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          DEFAULT: '#14b8a6',
          600: '#0d9488'
        },
        primary: '#14b8a6',
        secondary: '#0f766e',
        muted: '#6b7280'
      },
      backgroundImage: {
        'gradient-teal': 'linear-gradient(180deg, #a7f3d0 0%, #0f766e 100%)',
        'gradient-teal-soft': 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(15, 118, 110, 0.08) 100%)',
        'gradient-teal-dark': 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)',
        'gradient-button-teal': 'linear-gradient(180deg, #14b8a6 0%, #0d9488 100%)',
        'gradient-button-hover': 'linear-gradient(180deg, #0d9488 0%, #0f766e 100%)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'],
        heading: ['Poppins', 'Inter', 'ui-sans-serif']
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '3rem'
        }
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(15, 118, 110, 0.08)',
        'md': '0 4px 16px rgba(15, 118, 110, 0.12)',
        'lg': '0 8px 24px rgba(15, 118, 110, 0.15)',
        'xl': '0 12px 32px rgba(15, 118, 110, 0.18)',
        'premium': '0 12px 40px rgba(15, 118, 110, 0.15)'
      }
    },
  },
  plugins: [],
}
