import { useContext } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { ThemeContext } from '../context/ThemeContext'

const ThemeToggle = ({ position = 'fixed', top = 20, right = 20 }) => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext)

  return (
    <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
      <IconButton
        onClick={toggleDarkMode}
        sx={{
          position,
          top,
          right,
          zIndex: 1000,
          background: darkMode ? 'rgba(245,197,66,0.08)' : 'rgba(47,87,184,0.06)',
          border: darkMode ? '1.5px solid rgba(245,197,66,0.18)' : '1.5px solid rgba(47,87,184,0.14)',
          borderRadius: 'var(--theme-toggle-radius)',
          p: 1.25,
          color: darkMode ? 'var(--accent)' : 'var(--brand)',
          transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease, background 0.2s ease',
          '& .MuiSvgIcon-root': { fontSize: 'var(--theme-icon-size-lg)' },
          '&:hover': {
            background: darkMode ? 'rgba(245,197,66,0.12)' : 'rgba(47,87,184,0.12)',
            transform: 'translateY(-3px) scale(1.08)',
            boxShadow: darkMode ? 'var(--theme-toggle-hover-shadow)' : '0 8px 30px rgba(47,87,184,0.08)'
          }
        }}
      >
        {darkMode ? <Brightness7 sx={{ color: 'var(--accent)' }} /> : <Brightness4 sx={{ color: 'var(--brand)' }} />}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggle
