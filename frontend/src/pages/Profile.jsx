import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getProfile, updateProfile, changePassword, deleteAccount, uploadProfilePicture } from '../api/profile'
import Card from '../components/Card'
import Button from '../components/Button'
import { Camera, Upload } from 'lucide-react'

export default function Profile() {
  const { user, logout } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', email: '', phone: '', age: '', address: '', bio: '', profilePicture: null })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [settings, setSettings] = useState({ emailNotifications: true, smsNotifications: false, appNotifications: true })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('info')
  const [profilePictureFile, setProfilePictureFile] = useState(null)

  useEffect(() => { fetchProfile() }, [])

  async function fetchProfile() {
    try { setLoading(true); const res = await getProfile(); const data = res.data || res; setProfileData({ firstName: data.firstName || '', lastName: data.lastName || '', email: data.email || '', phone: data.phone || '', age: data.age || '', address: data.address || '', bio: data.bio || '', profilePicture: data.profilePicture || null }) } catch (e) { setError('Failed to load profile') } finally { setLoading(false) }
  }

  const handleProfileChange = (e) => setProfileData(p => ({ ...p, [e.target.name]: e.target.value }))
  const handlePasswordChange = (e) => setPasswordForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePictureFile(file)
      const reader = new FileReader()
      reader.onload = (event) => setProfileData(p => ({ ...p, profilePicture: event.target?.result }))
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      // If a new picture was selected, upload it first
      if (profilePictureFile && profileData.profilePicture) {
        try {
          await uploadProfilePicture({ image: profileData.profilePicture })
        } catch (err) {
          console.error('Upload picture failed', err)
          setError('Failed to upload profile picture')
          // continue to try updating other fields
        }
      }

      await updateProfile(profileData)
      setMessage('Profile saved')
      setProfilePictureFile(null)
    } catch (e) {
      setError('Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setError('Passwords do not match'); return }
    try { setLoading(true); await changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }); setMessage('Password changed'); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }) } catch (e) { setError('Failed to change password') } finally { setLoading(false) }
  }

  const handleToggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }))
  const handleDelete = async () => { if (!confirm('Delete account? This cannot be undone.')) return; try { setLoading(true); await deleteAccount(); logout() } catch (e) { setError('Failed to delete account') } finally { setLoading(false) } }

  const getProfilePictureUrl = () => profilePictureFile ? profileData.profilePicture : profileData.profilePicture || null

  return (
    <>
      <div className="min-h-screen w-full mx-0 px-3 sm:px-4 lg:px-6 py-8" style={{ background: 'linear-gradient(180deg, #a7f3d0 0%, #ffffff 55%, #ccfbf1 100%)', backgroundAttachment: 'fixed' }}>
        <div className="w-full mx-0 px-3 sm:px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Card>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {getProfilePictureUrl() ? (
                    <img src={getProfilePictureUrl()} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-teal-200" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">{(profileData.firstName||user?.email||'U')[0]?.toUpperCase()}</div>
                  )}
                  <label htmlFor="profilePictureInput" className="absolute bottom-0 right-0 bg-teal-600 hover:bg-teal-700 p-2 rounded-full cursor-pointer transition-colors">
                    <Camera size={16} className="text-white" />
                  </label>
                  <input id="profilePictureInput" type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{profileData.firstName} {profileData.lastName}</h2>
                  <p className="text-sm text-gray-600">{profileData.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Click camera icon to change photo</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="mb-6">
            <div className="flex gap-2 flex-wrap">
              {['info','edit','security','settings'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab===t? 'bg-teal-600 text-white shadow-md':'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100'}`}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
              ))}
            </div>
          </Card>

          {message && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg">{message}</div>}
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">{error}</div>}

          {activeTab==='info' && (
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><div className="text-sm text-gray-500">First Name</div><div className="font-medium">{profileData.firstName||'—'}</div></div>
                <div><div className="text-sm text-gray-500">Last Name</div><div className="font-medium">{profileData.lastName||'—'}</div></div>
                <div><div className="text-sm text-gray-500">Email</div><div className="font-medium">{profileData.email||'—'}</div></div>
                <div><div className="text-sm text-gray-500">Phone</div><div className="font-medium">{profileData.phone||'—'}</div></div>
                <div className="md:col-span-2"><div className="text-sm text-gray-500">Bio</div><div className="font-medium">{profileData.bio||'—'}</div></div>
              </div>
            </Card>
          )}

        {activeTab==='edit' && (
          <Card>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="firstName" value={profileData.firstName} onChange={handleProfileChange} placeholder="First name" className="p-3 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400" />
                <input name="lastName" value={profileData.lastName} onChange={handleProfileChange} placeholder="Last name" className="p-3 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400" />
                <input name="phone" value={profileData.phone} onChange={handleProfileChange} placeholder="Phone" className="p-3 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400" />
                <input name="age" value={profileData.age} onChange={handleProfileChange} placeholder="Age" className="p-3 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400" />
                <input name="address" value={profileData.address} onChange={handleProfileChange} placeholder="Address" className="p-3 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 md:col-span-2" />
                <textarea name="bio" value={profileData.bio} onChange={handleProfileChange} placeholder="Bio" className="p-3 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 md:col-span-2" rows={4} />
              </div>
              <div>
                <Button type="submit" variant="primary" className="w-full py-3">{loading ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab==='security' && (
          <Card>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input name="currentPassword" type="password" value={passwordForm.currentPassword} onChange={handlePasswordChange} placeholder="Current password" className="p-3 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 w-full" />
              <input name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePasswordChange} placeholder="New password" className="p-3 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 w-full" />
              <input name="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={handlePasswordChange} placeholder="Confirm new password" className="p-3 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 w-full" />
              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="primary" className="flex-1 py-3">{loading ? 'Changing...' : 'Change Password'}</Button>
                <Button type="button" onClick={handleDelete} variant="primary" className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg">{loading ? 'Deleting...' : 'Delete Account'}</Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab==='settings' && (
          <Card>
            <div className="space-y-3">
              {[
                { key: 'emailNotifications', label: 'Email Notifications' },
                { key: 'smsNotifications', label: 'SMS Notifications' },
                { key: 'appNotifications', label: 'App Notifications' }
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between p-4 bg-teal-50 border border-teal-100 rounded-lg">
                  <div className="font-medium text-gray-700">{s.label}</div>
                  <button onClick={() => handleToggle(s.key)} className={`px-4 py-2 rounded-lg font-semibold transition-all ${settings[s.key]? 'bg-teal-600 text-white shadow-md':'bg-gray-300 text-gray-700'}`}>{settings[s.key]? 'On':'Off'}</button>
                </div>
              ))}
            </div>
          </Card>
        )}
          </div>
        </div>
      </div>
    </>
  )
}
