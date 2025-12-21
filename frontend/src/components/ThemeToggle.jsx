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
          background: darkMode ? 'rgba(218,248,0,0.1)' : 'rgba(0, 150, 101, 0.1)',
          border: darkMode ? '1.5px solid rgba(218,248,0,0.3)' : '1.5px solid rgba(0, 150, 101, 0.3)',
          borderRadius: '12px',
          p: 1.5,
          color: darkMode ? '#daf800' : '#009665',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: darkMode ? 'rgba(218,248,0,0.15)' : 'rgba(0, 150, 101, 0.15)',
            transform: 'scale(1.1) rotate(20deg)',
            boxShadow: darkMode
              ? '0 4px 20px rgba(218,248,0,0.2)'
              : '0 4px 20px rgba(0,150,101,0.2)'
          }
        }}
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggle
