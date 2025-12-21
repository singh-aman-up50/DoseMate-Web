import { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material'
import { Visibility, VisibilityOff, Person, Email, Phone, LocationOn, Lock, CheckCircle, ArrowForward } from '@mui/icons-material'
import { AuthContext } from '../context/AuthContext'

const Register = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [stateName, setStateName] = useState('')
  const [district, setDistrict] = useState('')
  const [age, setAge] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  // Premium input styling with enhanced focus and hover states
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px',
      height: 52,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(10px)',
      border: '1.5px solid rgba(0, 150, 101, 0.15)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(0, 150, 101, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 150, 101, 0.08)'
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderColor: '#009665',
        boxShadow: '0 0 0 4px rgba(0, 150, 101, 0.12), 0 8px 24px rgba(0, 150, 101, 0.15)'
      }
    },
    '& .MuiOutlinedInput-input': {
      padding: '14px 16px',
      fontSize: '0.95rem',
      fontWeight: '500',
      color: '#1a1a1a',
      '&::placeholder': {
        color: '#999',
        opacity: 0.7
      }
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#666',
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: 'white',
      padding: '0 4px',
      '&.Mui-focused': {
        color: '#009665',
        fontWeight: '700'
      }
    },
    '& .MuiFormHelperText-root': {
      marginTop: '6px',
      fontSize: '0.8rem',
      color: '#f44336'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const combinedAddress = `${stateName || ''}${district ? (stateName ? ', ' : '') + district : ''}`
      await register(firstName, lastName, email, password, confirmPassword, phone, combinedAddress || null, parseInt(age) || null)
      setSuccess('Registration successful! Redirecting to login page...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      console.error('Registration error:', err)
      console.error('Error response:', err.response?.data)
      const errorData = err.response?.data
      if (typeof errorData === 'object') {
        if (errorData.error) {
          setError(errorData.error)
        } else {
          // Field validation errors
          const fieldErrors = Object.values(errorData).join(', ')
          setError(fieldErrors || 'Registration failed')
        }
      } else {
        setError('Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', py: 6 }}>
        <Card sx={{ width: '100%', borderRadius: 3, p: 4, boxShadow: '0 20px 60px rgba(0,150,101,0.12)', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: -80, right: -80, width: 220, height: 220, background: 'radial-gradient(circle, rgba(218,248,0,0.12) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />

          <Box sx={{ textAlign: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#009665,#daf800)', boxShadow: '0 8px 24px rgba(0,150,101,0.16)', mx: 'auto', mb: 2 }}>
              <Person sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, background: 'linear-gradient(135deg,#009665,#daf800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Create Account</Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>Join DoseMate to manage your medicines</Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '12px',
                borderLeft: '5px solid #f44336',
                fontWeight: '500'
              }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: '12px',
                borderLeft: '5px solid #4caf50',
                fontWeight: '500'
              }}
            >
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Row 1: First, Last, Age */}
              <Grid item xs={12} sm={4} md={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  sx={inputSx}
                  placeholder="First name"
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  sx={inputSx}
                  placeholder="Last name"
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  sx={inputSx}
                  placeholder="Age"
                />
              </Grid>

              {/* Row 2: Phone, District, State */}
              <Grid item xs={12} sm={4} md={4}>
                <TextField
                  fullWidth
                  label="Phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  sx={inputSx}
                  placeholder="Phone"
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                <TextField
                  fullWidth
                  label="District"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  sx={inputSx}
                  placeholder="District"
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                <TextField
                  fullWidth
                  label="State"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  sx={inputSx}
                  placeholder="State"
                />
              </Grid>

              {/* Row 3: Email */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={inputSx}
                  placeholder="Enter your email"
                />
              </Grid>

              {/* Row 4: Passwords */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={inputSx}
                  placeholder="Create a strong password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((s) => !s)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                          sx={{
                            color: '#009665',
                            '&:hover': { background: 'rgba(0, 150, 101, 0.08)' }
                          }}
                        >
                          {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  sx={inputSx}
                  placeholder="Confirm your password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword((s) => !s)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                          sx={{
                            color: '#009665',
                            '&:hover': { background: 'rgba(0, 150, 101, 0.08)' }
                          }}
                        >
                          {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{
                    py: 1.6,
                    fontSize: '1rem',
                    fontWeight: '700',
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #009665, #00c896)',
                    boxShadow: '0 12px 30px rgba(0,150,101,0.18)'
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      <span>Registering...</span>
                    </Box>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>Already have an account? <Link to="/login" style={{ color: '#009665', fontWeight: 700, textDecoration: 'none' }}>Login</Link></Typography>
          </Box>
        </Card>
      </Box>
    </Container>
  )
}

export default Register
