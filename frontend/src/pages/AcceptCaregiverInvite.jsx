import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/axios'
import { CheckCircle, AlertCircle } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'

export default function AcceptCaregiverInvite() {
  const navigate = useNavigate()
  const { code } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleAccept = async () => {
    setLoading(true)
    try {
      await api.post(`/caregiver/accept-invite/${code}`)
      setSuccess(true)
      setTimeout(() => navigate('/caregiver/dashboard'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid invite code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen page-bg p-8 flex items-center justify-center py-8" style={{ background: 'linear-gradient(180deg, #a7f3d0 0%, #ffffff 55%, #ccfbf1 100%)', backgroundAttachment: 'fixed' }}>
      <Card className="max-w-md w-full">
        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
            <h1 className="text-2xl font-bold mb-2">Welcome!</h1>
            <p className="text-gray-600 mb-4">You have been added as a caregiver. Redirecting to dashboard...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">Accept Caregiver Invite</h1>
            <p className="text-gray-600 mb-6">You have been invited to be a caregiver. Click below to accept.</p>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
                <div className="text-red-800">{error}</div>
              </div>
            )}

            <Button
              variant="primary"
              onClick={handleAccept}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Accepting...' : 'Accept Invite'}
            </Button>
          </>
        )}
      </Card>
    </div>
  )
}
