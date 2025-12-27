import { createContext, useState, useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

export const ThemeContext = createContext()

export const CustomThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    // Update HTML data-theme attribute for CSS variable support
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#0B3D91',
        light: '#2F57B8',
        dark: '#062A6A',
        contrastText: '#ffffff'
      },
      secondary: {
        main: '#F5C542',
        light: '#F9D97A',
        dark: '#B88B2D',
        contrastText: '#1f2937'
      },
      background: {
        default: darkMode ? '#1a1a1f' : '#ffffff',
        paper: darkMode ? '#242429' : '#f9fafb'
      },
      text: {
        primary: darkMode ? '#ffffff' : '#1f2937',
        secondary: darkMode ? '#e5e7eb' : '#6b7280'
      },
      error: { main: '#f44336', light: '#ef5350' },
      warning: { main: '#ff9800', light: '#ffb74d' },
      success: { main: '#4caf50', light: '#81c784' },
      info: { main: '#2196f3' }
    },
    typography: {
      fontFamily:
        'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: 16,
      h1: { fontSize: '28.8px', fontWeight: 700 },
      h2: { fontSize: '21.6px', fontWeight: 700 },
      h3: { fontSize: '18px', fontWeight: 700 },
      body1: { fontSize: '15px' },
      body2: { fontSize: '13px' }
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? 'rgba(30, 30, 35, 0.8)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: darkMode ? 'rgba(218, 248, 0, 0.15)' : 'rgba(0, 150, 101, 0.15)'
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 150, 101, 0.02)',
              color: darkMode ? '#ffffff' : '#1f2937'
            }
          }
        }
      }
    }
  })

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
