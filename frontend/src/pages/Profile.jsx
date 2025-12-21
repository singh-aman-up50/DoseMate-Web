import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  Tabs,
  Tab,
  TextField,
  Button,
  Alert,
  Avatar,
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  IconButton,
  Chip,
  Badge,
  CardContent
} from '@mui/material'
import { Edit, Camera, Delete, LogOut, User, Lock, Bell, Shield, Mail, Phone, MapPin, Cake, FileText } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  deleteAccount
} from '../api/profile'

function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

const Profile = () => {
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Account settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appNotifications: true,
    twoFactorAuth: false
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchProfile()
  }, [user, navigate])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await getProfile()
      setProfileData(response.data)
      setImagePreview(response.data.profilePictureUrl)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    setError('')
    setSuccess('')
  }

  // Profile Update Handler
  const handleProfileUpdate = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        address: profileData.address,
        age: profileData.age,
        bio: profileData.bio,
        profilePictureUrl: imagePreview
      }

      const response = await updateProfile(updateData)
      setProfileData(response.data)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Password Change Handler
  const handlePasswordChange = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError('New passwords do not match')
        setSaving(false)
        return
      }

      if (passwordForm.newPassword.length < 6) {
        setError('Password must be at least 6 characters')
        setSaving(false)
        return
      }

      await changePassword(passwordForm)
      setSuccess('Password changed successfully!')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      console.error('Error changing password:', err)
      setError(err.response?.data?.error || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  // Delete Account Handler
  const handleDeleteAccount = async () => {
    try {
      setSaving(true)
      await deleteAccount()
      setSuccess('Account deleted successfully')
      setTimeout(() => {
        logout()
        navigate('/login')
      }, 1500)
    } catch (err) {
      console.error('Error deleting account:', err)
      setError(err.response?.data?.error || 'Failed to delete account')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Grid container spacing={4}>
        {/* Premium Profile Header Card */}
        <Grid item xs={12}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #0096651a 0%, #daf8001a 100%), linear-gradient(to bottom, #ffffff, #f8fafb)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 150, 101, 0.12)',
              position: 'relative',
              border: '2px solid rgba(0, 150, 101, 0.1)'
            }}
          >
            {/* Decorative Background */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(0, 150, 101, 0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(50px, -50px)',
                pointerEvents: 'none'
              }}
            />

            <CardContent sx={{ position: 'relative', zIndex: 1, p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {/* Avatar with Badge */}
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    <Avatar
                      src={imagePreview}
                      sx={{
                        width: 140,
                        height: 140,
                        border: '4px solid white',
                        boxShadow: '0 10px 30px rgba(0, 150, 101, 0.2)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      {profileData?.firstName?.[0]}{profileData?.lastName?.[0]}
                    </Avatar>
                  </Badge>

                  {/* Camera Button Overlay */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: 'white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      '&:hover': {
                        background: '#f0f0f0',
                        transform: 'scale(1.1)'
                      },
                      width: 44,
                      height: 44,
                      transition: 'all 0.3s ease'
                    }}
                    size="small"
                    component="label"
                  >
                    <Camera size={20} color="#009665" />
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleImageUpload}
                    />
                  </IconButton>
                </Box>

                {/* User Info */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #009665 0%, #daf800 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.5px'
                      }}
                    >
                      {profileData?.firstName} {profileData?.lastName}
                    </Typography>
                    <Chip
                      label="Active"
                      color="success"
                      variant="filled"
                      size="small"
                      sx={{
                        fontWeight: '600',
                        background: 'linear-gradient(135deg, #daf800 0%, #00c896 100%)',
                        color: '#009665'
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Mail size={18} color="#009665" />
                    <Typography variant="body1" sx={{ color: '#666', fontWeight: '500' }}>
                      {profileData?.email}
                    </Typography>
                  </Box>

                  {profileData?.bio && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#666',
                        fontSize: '0.95rem',
                        fontStyle: 'italic',
                        lineHeight: '1.6'
                      }}
                    >
                      {profileData.bio}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Premium Tabs Section */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: '24px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              border: '1px solid rgba(0, 150, 101, 0.1)'
            }}
          >
            {/* Tab Header with Premium Styling */}
            <Box sx={{ background: 'linear-gradient(to right, #f8fafb 0%, #ffffff 100%)' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="profile tabs"
                sx={{
                  borderBottom: '2px solid rgba(0, 150, 101, 0.08)',
                  '& .MuiTab-root': {
                    fontSize: '1rem',
                    fontWeight: '600',
                    textTransform: 'none',
                    color: '#666',
                    transition: 'all 0.3s ease',
                    padding: '20px 24px',
                    minHeight: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      color: '#009665',
                      background: 'rgba(0, 150, 101, 0.03)'
                    }
                  },
                  '& .MuiTab-textColorPrimary.Mui-selected': {
                    color: '#009665',
                    fontWeight: '700'
                  },
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(90deg, #009665 0%, #daf800 100%)',
                    height: '4px',
                    borderRadius: '2px 2px 0 0'
                  }
                }}
              >
                <Tab
                  label="Profile Info"
                  icon={<User size={18} />}
                  iconPosition="start"
                  id="profile-tab-0"
                  aria-controls="profile-tabpanel-0"
                />
                <Tab
                  label="Edit Profile"
                  icon={<Edit size={18} />}
                  iconPosition="start"
                  id="profile-tab-1"
                  aria-controls="profile-tabpanel-1"
                />
                <Tab
                  label="Security"
                  icon={<Lock size={18} />}
                  iconPosition="start"
                  id="profile-tab-2"
                  aria-controls="profile-tabpanel-2"
                />
                <Tab
                  label="Settings"
                  icon={<Bell size={18} />}
                  iconPosition="start"
                  id="profile-tab-3"
                  aria-controls="profile-tabpanel-3"
                />
              </Tabs>
            </Box>

            {/* Alert Messages */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: '0px',
                  borderLeft: '5px solid #f44336',
                  fontSize: '0.95rem',
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
                  borderRadius: '0px',
                  borderLeft: '5px solid #4caf50',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}
              >
                {success}
              </Alert>
            )}

            {/* Tab 1: View Profile */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={2}>
                    <Paper
                      sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, rgba(0, 150, 101, 0.05) 0%, rgba(218, 248, 0, 0.03) 100%)',
                        border: '2px solid rgba(0, 150, 101, 0.1)',
                        borderRadius: '16px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(0, 150, 101, 0.3)',
                          boxShadow: '0 8px 24px rgba(0, 150, 101, 0.1)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Mail size={18} color="#009665" />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: '#009665',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            letterSpacing: '0.5px'
                          }}
                        >
                          FIRST NAME
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: '600', color: '#333', fontSize: '1.1rem' }}>
                        {profileData?.firstName}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2}>
                    <Paper
                      sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, rgba(0, 150, 101, 0.05) 0%, rgba(218, 248, 0, 0.03) 100%)',
                        border: '2px solid rgba(0, 150, 101, 0.1)',
                        borderRadius: '16px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(0, 150, 101, 0.3)',
                          boxShadow: '0 8px 24px rgba(0, 150, 101, 0.1)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Mail size={18} color="#009665" />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: '#009665',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            letterSpacing: '0.5px'
                          }}
                        >
                          LAST NAME
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: '600', color: '#333', fontSize: '1.1rem' }}>
                        {profileData?.lastName}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2}>
                    <Paper
                      sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, rgba(0, 150, 101, 0.05) 0%, rgba(218, 248, 0, 0.03) 100%)',
                        border: '2px solid rgba(0, 150, 101, 0.1)',
                        borderRadius: '16px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(0, 150, 101, 0.3)',
                          boxShadow: '0 8px 24px rgba(0, 150, 101, 0.1)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Mail size={18} color="#009665" />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: '#009665',
                            fontWeight: '700',
                            fontSize: '0.75rem',
                            letterSpacing: '0.5px'
                          }}
                        >
                          EMAIL
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: '600', color: '#333', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                        {profileData?.email}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2}>
                    <Paper
                      sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, rgba(0, 150, 101, 0.05) 0%, rgba(218, 248, 0, 0.03) 100%)',
                        border: '2px solid rgba(0, 150, 101, 0.1)',
                        borderRadius: '16px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(0, 150, 101, 0.3)',
                          boxShadow: '0 8px 24px rgba(0, 150, 101, 0.1)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Phone size={18} color="#009665" />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: '#009665',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            letterSpacing: '0.5px'
                          }}
                        >
                          PHONE
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: '600', color: '#333', fontSize: '1.1rem' }}>
                        {profileData?.phone || <span style={{ color: '#999', fontSize: '0.9rem' }}>N/A</span>}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2}>
                    <Paper
                      sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, rgba(0, 150, 101, 0.05) 0%, rgba(218, 248, 0, 0.03) 100%)',
                        border: '2px solid rgba(0, 150, 101, 0.1)',
                        borderRadius: '16px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(0, 150, 101, 0.3)',
                          boxShadow: '0 8px 24px rgba(0, 150, 101, 0.1)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Cake size={18} color="#009665" />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: '#009665',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            letterSpacing: '0.5px'
                          }}
                        >
                          AGE
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: '600', color: '#333', fontSize: '1.1rem' }}>
                        {profileData?.age || <span style={{ color: '#999', fontSize: '0.9rem' }}>N/A</span>}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2}>
                    <Paper
                      sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, rgba(0, 150, 101, 0.05) 0%, rgba(218, 248, 0, 0.03) 100%)',
                        border: '2px solid rgba(0, 150, 101, 0.1)',
                        borderRadius: '16px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(0, 150, 101, 0.3)',
                          boxShadow: '0 8px 24px rgba(0, 150, 101, 0.1)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <MapPin size={18} color="#009665" />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: '#009665',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            letterSpacing: '0.5px'
                          }}
                        >
                          ADDRESS
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: '600', color: '#333', fontSize: '0.9rem' }}>
                        {profileData?.address || <span style={{ color: '#999', fontSize: '0.9rem' }}>N/A</span>}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, rgba(0, 150, 101, 0.05) 0%, rgba(218, 248, 0, 0.03) 100%)',
                        border: '2px solid rgba(0, 150, 101, 0.1)',
                        borderRadius: '16px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(0, 150, 101, 0.3)',
                          boxShadow: '0 8px 24px rgba(0, 150, 101, 0.1)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <FileText size={18} color="#009665" />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: '#009665',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            letterSpacing: '0.5px'
                          }}
                        >
                          BIO
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: '500', color: '#333', lineHeight: '1.6' }}>
                        {profileData?.bio || <span style={{ color: '#999', fontStyle: 'italic' }}>No bio added yet</span>}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* Tab 2: Edit Profile */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 4, maxWidth: 800 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: '700', color: '#333' }}>
                  Update Your Personal Information
                </Typography>
                <Divider sx={{ mb: 4, borderColor: 'rgba(0, 150, 101, 0.1)' }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profileData?.firstName || ''}
                      onChange={(e) =>
                        setProfileData({ ...profileData, firstName: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: '#009665'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#009665',
                            boxShadow: '0 0 0 4px rgba(0, 150, 101, 0.1)'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#009665'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profileData?.lastName || ''}
                      onChange={(e) =>
                        setProfileData({ ...profileData, lastName: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: '#009665'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#009665',
                            boxShadow: '0 0 0 4px rgba(0, 150, 101, 0.1)'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#009665'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      type="tel"
                      value={profileData?.phone || ''}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: '#009665'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#009665',
                            boxShadow: '0 0 0 4px rgba(0, 150, 101, 0.1)'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#009665'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Age"
                      type="number"
                      value={profileData?.age || ''}
                      onChange={(e) =>
                        setProfileData({ ...profileData, age: parseInt(e.target.value) || null })
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: '#009665'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#009665',
                            boxShadow: '0 0 0 4px rgba(0, 150, 101, 0.1)'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#009665'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={profileData?.address || ''}
                      onChange={(e) =>
                        setProfileData({ ...profileData, address: e.target.value })
                      }
                      multiline
                      rows={2}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: '#009665'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#009665',
                            boxShadow: '0 0 0 4px rgba(0, 150, 101, 0.1)'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#009665'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      value={profileData?.bio || ''}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      multiline
                      rows={4}
                      variant="outlined"
                      placeholder="Tell us about yourself..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: '#009665'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#009665',
                            boxShadow: '0 0 0 4px rgba(0, 150, 101, 0.1)'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#009665'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleProfileUpdate}
                      disabled={saving}
                      sx={{
                        py: 1.8,
                        fontSize: '1rem',
                        fontWeight: '700',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #009665 0%, #00c896 100%)',
                        textTransform: 'none',
                        boxShadow: '0 8px 24px rgba(0, 150, 101, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 32px rgba(0, 150, 101, 0.4)'
                        },
                        '&:active': {
                          transform: 'translateY(0px)'
                        }
                      }}
                    >
                      {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* Tab 3: Change Password */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 4, maxWidth: 600 }}>
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Shield size={24} color="#009665" />
                    <Typography variant="h6" sx={{ fontWeight: '700', color: '#333' }}>
                      Change Your Password
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', lineHeight: '1.6' }}>
                    To keep your account secure, enter your current password and choose a new password.
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4, borderColor: 'rgba(0, 150, 101, 0.1)' }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: '#009665'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#009665',
                            boxShadow: '0 0 0 4px rgba(0, 150, 101, 0.1)'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#009665'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: '#009665'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#009665',
                            boxShadow: '0 0 0 4px rgba(0, 150, 101, 0.1)'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#009665'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: '#009665'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#009665',
                            boxShadow: '0 0 0 4px rgba(0, 150, 101, 0.1)'
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#009665'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handlePasswordChange}
                      disabled={saving}
                      sx={{
                        py: 1.8,
                        fontSize: '1rem',
                        fontWeight: '700',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #009665 0%, #00c896 100%)',
                        textTransform: 'none',
                        boxShadow: '0 8px 24px rgba(0, 150, 101, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 32px rgba(0, 150, 101, 0.4)'
                        },
                        '&:active': {
                          transform: 'translateY(0px)'
                        }
                      }}
                    >
                      {saving ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* Tab 4: Account Settings */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ p: 4 }}>
                {/* Notification Settings Section */}
                <Box sx={{ mb: 5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Bell size={24} color="#009665" />
                    <Typography variant="h6" sx={{ fontWeight: '700', color: '#333' }}>
                      Notification Preferences
                    </Typography>
                  </Box>

                  <List
                    sx={{
                      background: 'linear-gradient(135deg, rgba(0, 150, 101, 0.03) 0%, rgba(218, 248, 0, 0.02) 100%)',
                      borderRadius: '16px',
                      border: '2px solid rgba(0, 150, 101, 0.1)',
                      overflow: 'hidden',
                      '& .MuiListItem-root': {
                        borderBottom: '1px solid rgba(0, 150, 101, 0.1)',
                        py: 2.5,
                        '&:last-child': {
                          borderBottom: 'none'
                        }
                      }
                    }}
                  >
                    <ListItem
                      secondaryAction={
                        <Switch
                          edge="end"
                          checked={settings.emailNotifications}
                          onChange={(e) =>
                            setSettings({ ...settings, emailNotifications: e.target.checked })
                          }
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#daf800',
                              '&:hover': {
                                backgroundColor: 'rgba(218, 248, 0, 0.08)'
                              }
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#009665'
                            }
                          }}
                        />
                      }
                      sx={{ pl: 3 }}
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: '600', color: '#333', fontSize: '1rem' }}>
                            Email Notifications
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: '#999', mt: 0.5 }}>
                            Get important updates and reminders via email
                          </Typography>
                        }
                      />
                    </ListItem>

                    <ListItem
                      secondaryAction={
                        <Switch
                          edge="end"
                          checked={settings.smsNotifications}
                          onChange={(e) =>
                            setSettings({ ...settings, smsNotifications: e.target.checked })
                          }
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#daf800',
                              '&:hover': {
                                backgroundColor: 'rgba(218, 248, 0, 0.08)'
                              }
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#009665'
                            }
                          }}
                        />
                      }
                      sx={{ pl: 3 }}
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: '600', color: '#333', fontSize: '1rem' }}>
                            SMS Notifications
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: '#999', mt: 0.5 }}>
                            Receive critical alerts via SMS
                          </Typography>
                        }
                      />
                    </ListItem>

                    <ListItem
                      secondaryAction={
                        <Switch
                          edge="end"
                          checked={settings.appNotifications}
                          onChange={(e) =>
                            setSettings({ ...settings, appNotifications: e.target.checked })
                          }
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#daf800',
                              '&:hover': {
                                backgroundColor: 'rgba(218, 248, 0, 0.08)'
                              }
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#009665'
                            }
                          }}
                        />
                      }
                      sx={{ pl: 3 }}
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: '600', color: '#333', fontSize: '1rem' }}>
                            In-App Notifications
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: '#999', mt: 0.5 }}>
                            Show reminders and alerts within the app
                          </Typography>
                        }
                      />
                    </ListItem>

                    <ListItem
                      secondaryAction={
                        <Switch
                          edge="end"
                          checked={settings.twoFactorAuth}
                          onChange={(e) =>
                            setSettings({ ...settings, twoFactorAuth: e.target.checked })
                          }
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#daf800',
                              '&:hover': {
                                backgroundColor: 'rgba(218, 248, 0, 0.08)'
                              }
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#009665'
                            }
                          }}
                        />
                      }
                      sx={{ pl: 3 }}
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: '600', color: '#333', fontSize: '1rem' }}>
                            Two-Factor Authentication
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: '#999', mt: 0.5 }}>
                            Add an extra layer of security to your account
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Box>

                <Divider sx={{ my: 4, borderColor: 'rgba(0, 150, 101, 0.1)' }} />

                {/* Danger Zone */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Shield size={24} color="#f44336" />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: '700',
                        color: '#f44336',
                        fontSize: '1.1rem'
                      }}
                    >
                      Danger Zone
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={() => setOpenDeleteDialog(true)}
                        startIcon={<Delete size={18} />}
                        sx={{
                          py: 1.6,
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          borderRadius: '12px',
                          borderWidth: '2px',
                          borderColor: '#f44336',
                          color: '#f44336',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderWidth: '2px',
                            borderColor: '#f44336',
                            backgroundColor: 'rgba(244, 67, 54, 0.05)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 16px rgba(244, 67, 54, 0.2)'
                          }
                        }}
                      >
                        Delete Account
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => {
                          logout()
                          navigate('/login')
                        }}
                        startIcon={<LogOut size={18} />}
                        sx={{
                          py: 1.6,
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          borderRadius: '12px',
                          borderWidth: '2px',
                          borderColor: '#ff9800',
                          color: '#ff9800',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderWidth: '2px',
                            borderColor: '#ff9800',
                            backgroundColor: 'rgba(255, 152, 0, 0.05)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 16px rgba(255, 152, 0, 0.2)'
                          }
                        }}
                      >
                        Logout
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: '700', fontSize: '1.2rem', color: '#f44336', pt: 3 }}>
          Delete Account Permanently?
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1" sx={{ color: '#666', lineHeight: '1.8', mb: 2 }}>
            We're sorry to see you go! Are you sure you want to delete your account?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#f44336',
              fontWeight: '600',
              padding: '12px 16px',
              background: 'rgba(244, 67, 54, 0.08)',
              borderRadius: '8px',
              borderLeft: '4px solid #f44336'
            }}
          >
            ⚠️ This action cannot be undone. All your data will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 3, pr: 3, gap: 1 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              px: 3,
              py: 1,
              fontWeight: '600',
              borderRadius: '8px',
              textTransform: 'none',
              color: '#666'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpenDeleteDialog(false)
              handleDeleteAccount()
            }}
            color="error"
            variant="contained"
            disabled={saving}
            sx={{
              px: 3,
              py: 1,
              fontWeight: '700',
              borderRadius: '8px',
              textTransform: 'none',
              background: '#f44336',
              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
              '&:hover': {
                background: '#d32f2f'
              }
            }}
          >
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Delete Permanently'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Profile
