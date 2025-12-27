import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Card from '../components/Card'

export default function CaregiverProfile() {
  const { user } = useContext(AuthContext)

  if (!user) return <div className="min-h-screen p-0">Please login to view profile.</div>

  return (
    <div className="min-h-screen page-bg p-0 py-8" style={{ background: 'linear-gradient(180deg, #a7f3d0 0%, #ffffff 55%, #ccfbf1 100%)', backgroundAttachment: 'fixed' }}>
      <div className="w-full mx-0 px-3 sm:px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Caregiver Profile</h1>
          <p className="text-gray-600">Your registered details</p>
        </div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-semibold">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold">{user.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Organization</p>
              <p className="font-semibold">{user.organization || '-'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">License Number</p>
              <p className="font-semibold">{user.licenseNumber || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Specialization</p>
              <p className="font-semibold">{user.specialization || '-'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Experience (years)</p>
              <p className="font-semibold">{user.yearsExperience || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bio</p>
              <p className="font-semibold">{user.bio || '-'}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
