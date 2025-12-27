import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { api } from '../api/axios'
import { Copy, Check, UserPlus, Trash2, AlertCircle } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'

export default function ManageCaregivers() {
  const { user } = useContext(AuthContext)
  const [caregivers, setCaregivers] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copiedCode, setCopiedCode] = useState(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRelationship, setInviteRelationship] = useState('family_member')
  const [generatedInvite, setGeneratedInvite] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [caregiverRes, pendingRes] = await Promise.all([
        api.get('/caregiver/my-caregivers'),
        api.get('/caregiver/pending-requests')
      ])
      setCaregivers(caregiverRes.data)
      setPendingRequests(pendingRes.data)
      setError('')
    } catch (err) {
      console.error('Error fetching caregivers:', err)
      setError('Failed to load caregivers')
    } finally {
      setLoading(false)
    }
  }

  const generateInvite = async () => {
    if (!inviteEmail) {
      setError('Please enter caregiver email')
      return
    }

    try {
      const response = await api.post('/caregiver/generate-invite', {
        caregiverEmail: inviteEmail,
        relationship: inviteRelationship
      })
      setGeneratedInvite(response.data)
      setSuccess(`Invite generated! Code: ${response.data.inviteCode}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate invite')
    }
  }

  const approveCaregiver = async (relationId) => {
    try {
      await api.put(`/caregiver/${relationId}/approve`)
      setSuccess('Caregiver approved!')
      fetchData()
    } catch (err) {
      setError('Failed to approve caregiver')
    }
  }

  const rejectCaregiver = async (relationId) => {
    try {
      await api.put(`/caregiver/${relationId}/reject`)
      setSuccess('Caregiver request rejected')
      fetchData()
    } catch (err) {
      setError('Failed to reject request')
    }
  }

  const removeCaregiver = async (relationId) => {
    if (window.confirm('Are you sure you want to remove this caregiver?')) {
      try {
        await api.delete(`/caregiver/${relationId}`)
        setSuccess('Caregiver removed')
        fetchData()
      } catch (err) {
        setError('Failed to remove caregiver')
      }
    }
  }

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  if (loading) {
    return <div className="min-h-screen p-8 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen page-bg p-0 py-8" style={{ background: 'linear-gradient(180deg, #a7f3d0 0%, #ffffff 55%, #ccfbf1 100%)', backgroundAttachment: 'fixed' }}>
      <div className="w-full mx-0 px-3 sm:px-4 lg:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Caregivers</h1>
          <p className="text-gray-600">Control who can access and monitor your medications</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-2">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {success}
          </div>
        )}

        {/* Invite Section */}
        <Card className="mb-8 bg-gradient-to-r from-brand/5 to-accent/5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Invite Caregiver</h2>
              <p className="text-sm text-gray-600">Generate an invite code to share with a caregiver</p>
            </div>
            <button
              onClick={() => setShowInviteModal(!showInviteModal)}
              className="text-brand hover:text-brand/80 transition"
            >
              <UserPlus size={24} />
            </button>
          </div>

          {showInviteModal && (
            <div className="bg-white p-4 rounded-lg border space-y-3">
              <input
                type="email"
                placeholder="Caregiver email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <select
                value={inviteRelationship}
                onChange={(e) => setInviteRelationship(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="family_member">Family Member</option>
                <option value="nurse">Nurse</option>
                <option value="doctor">Doctor</option>
                <option value="son">Son</option>
                <option value="daughter">Daughter</option>
                <option value="caregiver">Caregiver</option>
              </select>
              <Button variant="primary" onClick={generateInvite} className="w-full">
                Generate Invite
              </Button>
            </div>
          )}

          {generatedInvite && (
            <div className="bg-brand/5 p-4 rounded-lg border-2 border-brand/30 mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Share this code:</p>
              <div className="flex items-center gap-2 bg-white p-3 rounded border border-brand/50">
                <code className="flex-1 font-mono font-bold text-lg tracking-wider">{generatedInvite.inviteCode}</code>
                <button
                  onClick={() => copyToClipboard(generatedInvite.inviteCode)}
                  className="p-2 hover:bg-gray-100 rounded transition"
                >
                  {copiedCode === generatedInvite.inviteCode ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <Copy size={18} className="text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-yellow-600" />
              Pending Requests ({pendingRequests.length})
            </h2>
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div>
                    <div className="font-semibold">{req.caregiverName}</div>
                    <div className="text-sm text-gray-500">{req.caregiverEmail}</div>
                    <div className="text-xs text-gray-400 mt-1">{req.relationship}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveCaregiver(req.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectCaregiver(req.id)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition text-sm font-medium"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Approved Caregivers */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Approved Caregivers ({caregivers.length})</h2>
          {caregivers.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No caregivers yet. Start by inviting one!</p>
          ) : (
            <div className="space-y-3">
              {caregivers.map((caregiver) => (
                <div key={caregiver.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div>
                    <div className="font-semibold">{caregiver.caregiverName}</div>
                    <div className="text-sm text-gray-500">{caregiver.caregiverEmail}</div>
                    <div className="text-xs text-gray-400 mt-1">{caregiver.relationship}</div>
                  </div>
                  <button
                    onClick={() => removeCaregiver(caregiver.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Remove caregiver"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
