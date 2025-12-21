import { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Card,
  Divider,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material'
import { Visibility, VisibilityOff, Lock, MailOutline } from '@mui/icons-material'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const { darkMode, toggleDarkMode } = useContext(ThemeContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      height: 48,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,150,101,0.02)',
      border: '2px solid',
      borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,150,101,0.1)',
      '&:hover fieldset': {
        borderColor: '#009665',
        backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,150,101,0.05)'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#009665',
        borderWidth: '2px',
        boxShadow: '0 0 0 4px rgba(0,150,101,0.1)'
      }
    },
    '& .MuiInputBase-input': {
      fontSize: '15px',
      fontWeight: '500',
      padding: '12px 16px',
      color: darkMode ? '#ffffff' : '#1f2937'
    },
    '& .MuiInputLabel-root': {
      fontSize: '14px',
      fontWeight: '600',
      color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
      '&.Mui-focused': { color: '#009665' }
    }
  }

  const [showPassword, setShowPassword] = useState(false)

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 2 }}>
      {/* Animated Background Gradient */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #dd5e89 0%, #f7bb97 100%)',
        pointerEvents: 'none',
        zIndex: -1
      }} />
      
      {/* Overlay for better contrast */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: darkMode
          ? 'radial-gradient(circle at 30% 50%, rgba(13, 115, 119, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 70% 60%, rgba(132, 204, 22, 0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: -1
      }} />

      {/* Theme Toggle Button */}
      <ThemeToggle />

      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'center',
        alignItems: 'center',
        gap: { xs: 3, md: 8 },
        px: { xs: 2, md: 4 }
      }}>
        {/* Left: image wrapper */}
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
          <img
            src="/l.png"
            alt="Login visual"
            style={{
              width: '100%',
              maxWidth: 450,
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </Box>

        {/* Right: form wrapper */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Card sx={{
            width: '100%',
            maxWidth: 500,
            borderRadius: '24px',
            p: { xs: 3, sm: 4 },
            backdropFilter: 'blur(30px)',
            background: darkMode
              ? 'linear-gradient(135deg, rgba(30,35,50,0.7) 0%, rgba(20,25,40,0.6) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(240,255,240,0.8) 100%)',
            border: '1.5px solid',
            borderColor: darkMode
              ? 'rgba(100, 200, 150, 0.3)'
              : 'rgba(132, 204, 22, 0.4)',
            boxShadow: darkMode
              ? '0 25px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(100,200,150,0.2), 0 0 40px rgba(13,115,119,0.3)'
              : '0 25px 80px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8), 0 0 40px rgba(132,204,22,0.2)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: darkMode
                ? '0 35px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(100,200,150,0.3), 0 0 60px rgba(13,115,119,0.5)'
                : '0 35px 100px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 60px rgba(132,204,22,0.3)',
              transform: 'translateY(-5px)'
            }
          }}>>
            {/* Decorative elements */}
            <Box sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              background: 'radial-gradient(circle, rgba(218,248,0,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />
            <Box sx={{
              position: 'absolute',
              bottom: -50,
              left: -50,
              width: 150,
              height: 150,
              background: 'radial-gradient(circle, rgba(0,150,101,0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {/* Header */}
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #009665, #00d084)',
                  mb: 2,
                  mx: 'auto',
                  boxShadow: '0 8px 24px rgba(0,150,101,0.3)',
                  transition: 'all 0.3s ease'
                }}>
                  <Lock sx={{ fontSize: 32, color: '#fff' }} />
                </Box>
                <Typography variant="h4" sx={{
                  fontWeight: 800,
                  mb: 0.5,
                  background: 'linear-gradient(135deg, #009665, #daf800)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '28px', sm: '32px' }
                }}>
                  Welcome Back
                </Typography>
                <Typography sx={{
                  color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Sign in to continue to DoseMate
                </Typography>
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{
                  mb: 2.5,
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: 'error.main',
                  background: 'rgba(244,67,54,0.08)',
                  animation: 'slideIn 0.3s ease-out'
                }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {/* Email Field */}
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                    sx={inputSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutline sx={{ color: '#009665' }} />
                          </InputAdornment>
                        )
                      }
                    }}
                  />

                  {/* Password Field */}
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="off"
                    sx={inputSx}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((s) => !s)}
                              onMouseDown={(e) => e.preventDefault()}
                              edge="end"
                              sx={{ color: '#009665' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />

                  {/* Submit Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{
                      mt: 2,
                      py: 1.6,
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '700',
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #009665, #00d084)',
                      boxShadow: '0 8px 24px rgba(0,150,101,0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transition: 'left 0.5s ease',
                      },
                      '&:hover:not(:disabled)::before': {
                        left: '100%',
                      },
                      '&:hover:not(:disabled)': {
                        boxShadow: '0 12px 32px rgba(0,150,101,0.4)',
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': {
                        opacity: 0.7,
                        cursor: 'not-allowed'
                      }
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff',
                          animation: 'spin 0.8s linear infinite'
                        }} />
                        Logging in...
                      </Box>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </Box>
              </form>

              {/* Register Link */}
              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <Typography sx={{ fontSize: '14px', color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', mb: 1 }}>
                  Don't have an account?
                </Typography>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Typography sx={{
                    fontSize: '15px',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #009665, #daf800)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      filter: 'brightness(1.1)'
                    }
                  }}>
                    Register here →
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* CSS for Autocomplete Styling and Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Remove autocomplete styling */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
          box-shadow: 0 0 0 1000px transparent inset !important;
          -webkit-transition: background-color 5000s ease-in-out 0s !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }

        input:-webkit-autofill {
          -webkit-text-fill-color: var(--text-primary) !important;
        }

        /* Target dark mode autofill */
        html[data-theme="dark"] input:-webkit-autofill,
        html[data-theme="dark"] input:-webkit-autofill:hover,
        html[data-theme="dark"] input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0.05) inset !important;
          box-shadow: 0 0 0 1000px rgba(255,255,255,0.05) inset !important;
          -webkit-text-fill-color: #ffffff !important;
        }

        /* Target light mode autofill */
        html[data-theme="light"] input:-webkit-autofill,
        html[data-theme="light"] input:-webkit-autofill:hover,
        html[data-theme="light"] input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px rgba(0,150,101,0.02) inset !important;
          box-shadow: 0 0 0 1000px rgba(0,150,101,0.02) inset !important;
          -webkit-text-fill-color: #1f2937 !important;
        }
      `}</style>
    </Container>
  )
}

export default Login
