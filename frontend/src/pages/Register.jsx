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
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Tooltip
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'

const Register = () => {
  const [roleSelected, setRoleSelected] = useState(null)
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
  const [focusedField, setFocusedField] = useState(null)
  const [role, setRole] = useState('ROLE_USER')
  const [organization, setOrganization] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [yearsExperience, setYearsExperience] = useState('')
  
  const { register } = useContext(AuthContext)
  const { darkMode, toggleDarkMode } = useContext(ThemeContext)
  const navigate = useNavigate()

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: '', color: 'error' }
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[@$!%*?&#]/.test(password)) strength++
    
    const strengths = [
      { strength: 0, label: 'Weak', color: 'error' },
      { strength: 1, label: 'Weak', color: 'error' },
      { strength: 2, label: 'Fair', color: 'warning' },
      { strength: 3, label: 'Good', color: 'success' },
      { strength: 4, label: 'Strong', color: 'success' }
    ]
    return strengths[strength]
  }

  const passwordStrength = getPasswordStrength()

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '16px',
      height: 40,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: 'rgba(20, 184, 166, 0.05)',
      border: '2px solid',
      borderColor: 'rgba(20, 184, 166, 0.2)',
      '&:hover fieldset': {
        borderColor: 'var(--brand)',
        backgroundColor: 'rgba(20, 184, 166, 0.08)'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--brand)',
        borderWidth: '2px',
        boxShadow: '0 0 0 3px rgba(20, 184, 166, 0.1)'
      }
    },
    '& .MuiInputBase-input': {
      fontSize: '15px',
      fontWeight: '500',
      padding: '12px 18px'
    },
    '& .MuiInputLabel-root': {
      fontSize: '14px',
      fontWeight: '600',
      '&.Mui-focused': { color: 'var(--brand)' }
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
      const caregiverMeta = role === 'ROLE_CAREGIVER' ? {
        organization: organization || null,
        licenseNumber: licenseNumber || null,
        specialization: specialization || null,
        yearsExperience: yearsExperience ? parseInt(yearsExperience) : null
      } : null

      await register(firstName, lastName, email, password, confirmPassword, phone, combinedAddress || null, parseInt(age) || null, role, caregiverMeta)
      setSuccess('Registration successful! Redirecting to login page...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      console.error('Registration error:', err)
      const errorData = err.response?.data
      if (typeof errorData === 'object') {
        if (errorData.error) {
          setError(errorData.error)
        } else {
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
    <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 2 }}>
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #14b8a6, #0d9488, #0f766e)',
        pointerEvents: 'none',
        zIndex: -1
      }} />
      
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: darkMode
          ? 'radial-gradient(circle at 30% 50%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 70% 60%, rgba(20, 184, 166, 0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: -1
      }} />

      <ThemeToggle />

      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'center',
        alignItems: 'center',
        gap: { xs: 3, md: 8 },
        px: { xs: 2, md: 4 }
      }}>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Card sx={{
            width: '100%',
            maxWidth: 480,
            borderRadius: '24px',
            p: { xs: '28px 24px', sm: '32px 28px' },
            backdropFilter: 'blur(30px)',
            background: darkMode
              ? 'linear-gradient(180deg, rgba(20,184,166,0.15) 0%, rgba(15,118,110,0.25) 50%, rgba(20,184,166,0.08) 100%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.55))',
            border: '1.5px solid',
            borderColor: 'rgba(20, 184, 166, 0.15)',
            boxShadow: darkMode
              ? '0 20px 60px rgba(20,184,166,0.25), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 50px rgba(15,118,110,0.15)'
              : '0 8px 24px rgba(15, 118, 110, 0.12)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: darkMode
                ? '0 30px 80px rgba(20,184,166,0.35), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 70px rgba(15,118,110,0.2)'
                : '0 12px 32px rgba(15, 118, 110, 0.15)',
              transform: 'translateY(-4px)'
            }
          }}>
            <Box sx={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: 120,
              height: 120,
              background: darkMode
                ? 'radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />
            <Box sx={{
              position: 'absolute',
              bottom: -40,
              left: -40,
              width: 120,
              height: 120,
              background: darkMode
                ? 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {/* Header */}
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{
                  fontWeight: 800,
                  mb: 0.3,
                  background: 'linear-gradient(135deg, var(--brand), var(--accent))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '26px', sm: '30px' }
                }}>
                  DoseMate
                </Typography>
                <Typography sx={{
                  color: darkMode ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.7)',
                  fontSize: '13px',
                  fontWeight: '500',
                  letterSpacing: '0.3px'
                }}>
                  {roleSelected ? (roleSelected === 'ROLE_USER' ? '👤 Patient Registration' : '🏥 Caregiver Registration') : 'Select your role to begin'}
                </Typography>
              </Box>

              {/* Alerts */}
              {error && (
                <Alert severity="error" sx={{
                  mb: 2.5,
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: 'error.main',
                  background: 'rgba(244,67,54,0.08)',
                  animation: 'slideIn 0.3s ease-out'
                }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{
                  mb: 2.5,
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: 'success.main',
                  background: 'rgba(76,175,80,0.08)',
                  animation: 'slideIn 0.3s ease-out'
                }}>
                  {success}
                </Alert>
              )}

              {/* STEP 1: Role Selection */}
              {!roleSelected && (
                <Box sx={{ py: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {/* Patient Option */}
                    <Box
                      onClick={() => {
                        setRoleSelected('ROLE_USER')
                        setRole('ROLE_USER')
                      }}
                      sx={{
                        p: '20px 24px',
                        borderRadius: '18px',
                        border: '2px solid',
                        borderColor: 'var(--brand)',
                        background: darkMode 
                          ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0.08) 100%)'
                          : 'linear-gradient(135deg, rgba(20, 184, 166, 0.05) 0%, rgba(20, 184, 166, 0.02) 100%)',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          background: darkMode 
                            ? 'linear-gradient(135deg, rgba(245, 197, 66, 0.1) 0%, transparent 100%)'
                            : 'linear-gradient(135deg, rgba(245, 197, 66, 0.15) 0%, transparent 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        },
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: darkMode
                            ? '0 16px 40px rgba(20, 184, 166, 0.3)'
                            : '0 16px 40px rgba(20, 184, 166, 0.15)',
                          borderColor: 'var(--accent)',
                          borderWidth: '2px',
                          '&::before': {
                            opacity: 1
                          }
                        }
                      }}
                    >
                      <Typography sx={{
                        fontWeight: '700',
                        fontSize: '18px',
                        mb: 0.5,
                        color: 'var(--brand)',
                        position: 'relative',
                        zIndex: 1
                      }}>
                        👤 Patient
                      </Typography>
                      <Typography sx={{
                        fontSize: '13px',
                        color: darkMode ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.7)',
                        lineHeight: '1.4',
                        position: 'relative',
                        zIndex: 1,
                        fontWeight: '500'
                      }}>
                        Track medications & health records
                      </Typography>
                    </Box>

                    {/* Caregiver Option */}
                    <Box
                      onClick={() => {
                        setRoleSelected('ROLE_CAREGIVER')
                        setRole('ROLE_CAREGIVER')
                      }}
                      sx={{
                        p: '20px 24px',
                        borderRadius: '18px',
                        border: '2px solid',
                        borderColor: 'var(--accent)',
                        background: darkMode 
                          ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0.08) 100%)'
                          : 'linear-gradient(135deg, rgba(20, 184, 166, 0.05) 0%, rgba(20, 184, 166, 0.02) 100%)',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          background: darkMode 
                            ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, transparent 100%)'
                            : 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, transparent 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        },
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: darkMode
                            ? '0 16px 40px rgba(20, 184, 166, 0.3)'
                            : '0 16px 40px rgba(20, 184, 166, 0.2)',
                          borderColor: 'var(--brand)',
                          borderWidth: '2px',
                          '&::before': {
                            opacity: 1
                          }
                        }
                      }}
                    >
                      <Typography sx={{
                        fontWeight: '700',
                        fontSize: '18px',
                        mb: 0.5,
                        color: 'var(--accent)',
                        position: 'relative',
                        zIndex: 1
                      }}>
                        🏥 Caregiver
                      </Typography>
                      <Typography sx={{
                        fontSize: '13px',
                        color: darkMode ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.7)',
                        lineHeight: '1.4',
                        position: 'relative',
                        zIndex: 1,
                        fontWeight: '500'
                      }}>
                        Monitor & manage patient
                        Monitor patients, manage prescriptions, and coordinate care
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* STEP 2: Registration Form */}
              {roleSelected && (
                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    {/* Back Button */}
                    <Button
                      onClick={() => {
                        setRoleSelected(null)
                        setError('')
                      }}
                      sx={{
                        textTransform: 'none',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'var(--brand)',
                        mb: 0.5,
                        justifyContent: 'flex-start',
                        pl: 0,
                        '&:hover': {
                          background: 'transparent',
                          filter: 'brightness(0.85)'
                        }
                      }}
                    >
                      ← Back to role selection
                    </Button>

                    {/* Name Fields */}
                    <Box sx={{ display: 'flex', gap: 1.2 }}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        sx={inputSx}
                      />
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        sx={inputSx}
                      />
                    </Box>

                    {/* Email Field */}
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="off"
                      sx={inputSx}
                    />

                    {/* Contact Fields */}
                    <Box sx={{ display: 'flex', gap: 1.2 }}>
                      <TextField
                        fullWidth
                        label="Phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        sx={inputSx}
                      />
                      <TextField
                        fullWidth
                        label="Age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        sx={inputSx}
                      />
                    </Box>

                    {/* Location Fields */}
                    <Box sx={{ display: 'flex', gap: 1.2 }}>
                      <TextField
                        fullWidth
                        label="State"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        sx={inputSx}
                      />
                      <TextField
                        fullWidth
                        label="District"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        sx={inputSx}
                      />
                    </Box>

                    {/* CAREGIVER-SPECIFIC FIELDS */}
                    {roleSelected === 'ROLE_CAREGIVER' && (
                      <Box sx={{
                        p: 1.5,
                        borderRadius: '20px',
                        background: darkMode 
                          ? 'rgba(20, 184, 166, 0.08)' 
                          : 'rgba(20, 184, 166, 0.07)',
                        border: '2px dashed var(--brand)',
                        my: 0.8
                      }}>
                        <Typography sx={{
                          fontSize: '12px',
                          fontWeight: '700',
                        color: 'var(--brand)',
                          mb: 1,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          📋 Professional Information
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <TextField
                            fullWidth
                            label="Organization / Hospital"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            placeholder="Enter your organization name"
                            sx={inputSx}
                          />
                          <TextField
                            fullWidth
                            label="License Number"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            placeholder="Your professional license number"
                            sx={inputSx}
                          />
                          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.2 }}>
                            <TextField
                              fullWidth
                              label="Specialization"
                              value={specialization}
                              onChange={(e) => setSpecialization(e.target.value)}
                              placeholder="e.g., Nursing"
                              sx={inputSx}
                            />
                            <TextField
                              fullWidth
                              label="Years of Experience"
                              type="number"
                              value={yearsExperience}
                              onChange={(e) => setYearsExperience(e.target.value)}
                              placeholder="Years"
                              sx={inputSx}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {/* Password Field */}
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{
                                color: showPassword ? 'var(--brand)' : 'var(--text-secondary)',
                                transition: 'all 0.2s'
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={inputSx}
                    />

                    {/* Password Strength Indicator */}
                    {password && (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                          <Typography sx={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                            Password Strength
                          </Typography>
                          <Typography sx={{ fontSize: '11px', fontWeight: '700', color: passwordStrength.color + '.main' }}>
                            {passwordStrength.label}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(passwordStrength.strength / 4) * 100}
                          sx={{
                            height: 5,
                            borderRadius: '20px',
                            background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: '20px',
                              background: `linear-gradient(90deg, var(--brand), var(--accent))`
                            }
                          }}
                        />
                      </Box>
                    )}

                    {/* Confirm Password */}
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              sx={{
                                color: showConfirmPassword ? 'var(--brand)' : 'var(--text-secondary)',
                                transition: 'all 0.2s'
                              }}
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={inputSx}
                    />

                    {/* Submit Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      disabled={loading}
                      sx={{
                        py: 1.3,
                        fontSize: '15px',
                        fontWeight: '700',
                        borderRadius: '20px',
                      background: 'linear-gradient(90deg, #14b8a6 0%, #0d9488 100%)',
                      textTransform: 'none',
                      boxShadow: '0 8px 24px rgba(20, 184, 166, 0.3)',
                        transition: 'all 0.3s ease',
                        mt: 1.2,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 32px rgba(11, 61, 145, 0.4)'
                        },
                        '&:active': {
                          transform: 'translateY(0px)'
                        },
                        '&:disabled': {
                          opacity: 0.7,
                          cursor: 'not-allowed'
                        }
                      }}
                    >
                      {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Box sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: '#fff',
                            animation: 'spin 0.8s linear infinite'
                          }} />
                          Creating Account...
                        </Box>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </Box>
                </form>
              )}

              {/* Login Link */}
              <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <Typography sx={{ fontSize: '13px', color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', mb: 0.6 }}>
                  Already have an account?
                </Typography>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography sx={{
                    fontSize: '14px',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, var(--brand), var(--accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      filter: 'brightness(1.1)'
                    }
                  }}>
                    Sign in here →
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Right: Image Section */}
        <Box sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img
            src="/r.png"
            alt="Registration visual"
            style={{
              width: '100%',
              maxWidth: 450,
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </Box>
      </Box>

      {/* CSS Animations */}
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

        html[data-theme="dark"] input:-webkit-autofill,
        html[data-theme="dark"] input:-webkit-autofill:hover,
        html[data-theme="dark"] input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0.05) inset !important;
          box-shadow: 0 0 0 1000px rgba(255,255,255,0.05) inset !important;
          -webkit-text-fill-color: #ffffff !important;
        }

        html[data-theme="light"] input:-webkit-autofill,
        html[data-theme="light"] input:-webkit-autofill:hover,
        html[data-theme="light"] input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px rgba(20,184,166,0.05) inset !important;
          box-shadow: 0 0 0 1000px rgba(20,184,166,0.05) inset !important;
          -webkit-text-fill-color: #1f2937 !important;
        }
      `}</style>
    </Container>
  )
}

export default Register
