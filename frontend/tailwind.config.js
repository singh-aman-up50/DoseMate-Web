/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6faf0',
          100: '#c9f5df',
          200: '#99ebbf',
          300: '#66d89a',
          400: '#33c77a',
          DEFAULT: '#009665',
          700: '#007a53',
          800: '#055a42',
          900: '#03392b'
        },
        accent: {
          50: '#fffdf0',
          100: '#fffbe6',
          DEFAULT: '#DAF800',
          700: '#b8b800'
        },
        primary: '#009665',
        secondary: '#DAF800',
        muted: '#6b7280'
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
        xl: '1rem'
      }
    },
  },
  plugins: [],
}
