import api from './axios'

// Get user profile
export const getProfile = () => {
  return api.get('/profile')
}

// Update user profile
export const updateProfile = (profileData) => {
  return api.put('/profile', profileData)
}

// Change password
export const changePassword = (passwordData) => {
  return api.post('/profile/change-password', passwordData)
}

// Upload profile picture (with base64 or URL)
export const uploadProfilePicture = (pictureData) => {
  return api.post('/profile/upload-picture', pictureData)
}

// Delete account
export const deleteAccount = () => {
  return api.delete('/profile')
}
