import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { api } from '../api/axios'
import { AlertCircle, Users, Heart, TrendingUp } from 'lucide-react'
import ChatWidget from '../components/ChatWidget'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default function CaregiverDashboard() {
  const { user } = useContext(AuthContext)
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientReminders, setPatientReminders] = useState([])
  const [patientHistory, setPatientHistory] = useState([])
  const [pendingInvites, setPendingInvites] = useState([])

  useEffect(() => {
    fetchPatients()
    fetchPendingInvites()
  }, [])

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const response = await api.get('/caregiver/my-patients')
      setPatients(response.data)
      setError('')
    } catch (err) {
      console.error('Error fetching patients:', err)
      setError('Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  const viewPatientDetails = async (patientId) => {
    try {
      setError('')
      setDetailsLoading(true)
      setSelectedPatient(patientId)
      const [reminders, history] = await Promise.all([
        api.get(`/caregiver/patient/${patientId}/reminders`).catch(err => {
          console.warn('Reminders fetch failed:', err)
          return { data: [] }
        }),
        api.get(`/caregiver/patient/${patientId}/history`).catch(err => {
          console.warn('History fetch failed:', err)
          return { data: [] }
        })
      ])
      setPatientReminders(Array.isArray(reminders.data) ? reminders.data : [])
      setPatientHistory(Array.isArray(history.data) ? history.data : [])
    } catch (err) {
      console.error('Error fetching patient details:', err)
      setError('Failed to load patient details')
      setPatientReminders([])
      setPatientHistory([])
    } finally {
      setDetailsLoading(false)
    }
  }

  const computeWeeklyAdherence = (history = []) => {
    // Ensure history is an array
    const historyArray = Array.isArray(history) ? history : []
    
    // build last 7 days buckets (label: Mon, Tue..)
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const label = d.toLocaleDateString(undefined, { weekday: 'short' })
      days.push({ date: d.toISOString().slice(0,10), label, taken: 0, missed: 0 })
    }

    historyArray.forEach(h => {
      const ts = new Date(h.timestamp)
      const day = ts.toISOString().slice(0,10)
      const bucket = days.find(d => d.date === day)
      if (bucket) {
        if (h.status === 'TAKEN') bucket.taken++
        else if (h.status === 'MISSED') bucket.missed++
      }
    })

    return days.map(d => ({ name: d.label, taken: d.taken, missed: d.missed }))
  }

  const fetchPendingInvites = async () => {
    try {
      const res = await api.get('/caregiver/pending-invites')
      setPendingInvites(res.data || [])
    } catch (err) {
      console.error('Error fetching pending invites:', err)
    }
  }

  if (loading) {
    return <div className="min-h-screen p-8 flex items-center justify-center">Loading caregiver dashboard...</div>
  }

  return (
    <>
      <div className="min-h-screen page-bg p-0 py-8" style={{ background: 'linear-gradient(180deg, #a7f3d0 0%, #ffffff 55%, #ccfbf1 100%)', backgroundAttachment: 'fixed' }}>
        <div className="w-full mx-0 px-3 sm:px-4 lg:px-6">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Caregiver Dashboard 👨‍⚕️</h1>
            <p className="text-gray-600">Monitor and manage your patients' medications</p>
          </div>

          {error && <div className="mb-4 text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Invites (caregiver) */}
            <div className="lg:col-span-1 card">
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-brand" size={24} />
                <h2 className="text-xl font-semibold">Pending Invites ({pendingInvites.length})</h2>
              </div>
              {pendingInvites.length === 0 ? (
                <div className="text-gray-600 text-center py-6">No pending invites</div>
              ) : (
                <div className="space-y-2">
                  {pendingInvites.map((inv) => (
                    <div key={inv.id} className="p-3 border rounded-lg">
                      <div className="font-semibold">From: {inv.patientName}</div>
                      <div className="text-sm text-gray-500">{inv.patientEmail}</div>
                      <div className="mt-2 text-xs text-gray-600">Relationship: {inv.relationship}</div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              await api.post(`/caregiver/${inv.id}/respond`, { action: 'ACCEPT' })
                              fetchPendingInvites()
                              fetchPatients()
                            } catch (err) {
                              console.error('Error accepting invite', err)
                            }
                          }}
                          className="px-3 py-1 bg-brand text-white rounded-md text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await api.post(`/caregiver/${inv.id}/respond`, { action: 'REJECT' })
                              fetchPendingInvites()
                            } catch (err) {
                              console.error('Error rejecting invite', err)
                            }
                          }}
                          className="px-3 py-1 border border-gray-200 rounded-md text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Patients List */}
            <div className="lg:col-span-1 card">
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-brand" size={24} />
                <h2 className="text-xl font-semibold">My Patients ({patients.length})</h2>
              </div>
              
              {patients.length === 0 ? (
                <div className="text-gray-600 text-center py-8">
                  <p>No patients added yet</p>
                  <p className="text-sm mt-2">Share your caregiver invite code with patients to get started</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {patients.map((patient) => (
                    <button
                      key={patient.patientId}
                      onClick={() => viewPatientDetails(patient.patientId)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        selectedPatient === patient.patientId
                          ? 'border-brand bg-brand/5'
                          : 'border-gray-100 hover:border-brand/50'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{patient.patientName}</div>
                      <div className="text-sm text-gray-500">{patient.patientEmail}</div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs bg-brand/10 text-brand px-2 py-1 rounded">
                          {patient.adherenceRate.toFixed(1)}% adherence
                        </span>
                        <span className="text-xs text-gray-500">
                          {patient.pendingRemindersCount} pending
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Patient Details */}
            {selectedPatient ? (
              <div className="lg:col-span-2">
                {detailsLoading ? (
                  <div className="card flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading patient details...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Patient Overview */}
                    <div className="card mb-6">
                      {patients.find(p => p.patientId === selectedPatient) && (
                        <>
                          <h3 className="text-xl font-semibold mb-4">
                            {patients.find(p => p.patientId === selectedPatient)?.patientName}
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-brand/5 p-4 rounded-lg">
                              <div className="text-sm text-gray-600">Adherence Rate</div>
                              <div className="text-2xl font-bold text-brand">
                                {patients.find(p => p.patientId === selectedPatient)?.adherenceRate.toFixed(1)}%
                              </div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-600">Missed Doses</div>
                              <div className="text-2xl font-bold text-red-600">
                                {patients.find(p => p.patientId === selectedPatient)?.missedRemindersCount || 0}
                              </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-600">Active Medicines</div>
                              <div className="text-2xl font-bold text-blue-600">
                                {patients.find(p => p.patientId === selectedPatient)?.medicinesCount || 0}
                              </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-600">Pending Reminders</div>
                              <div className="text-2xl font-bold text-green-600">
                                {patients.find(p => p.patientId === selectedPatient)?.pendingRemindersCount || 0}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Pending Reminders */}
                    {patientReminders.length > 0 && (
                      <div className="card mb-6">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle className="text-brand" size={20} />
                          <h3 className="text-lg font-semibold">Pending Reminders ({patientReminders.length})</h3>
                        </div>
                        <div className="space-y-3">
                          {patientReminders.map((reminder) => (
                            <div key={reminder.id} className="flex items-center justify-between p-4 bg-white border rounded-lg">
                              <div>
                                <div className="font-semibold">{reminder.medicineName}</div>
                                <div className="text-sm text-gray-500">
                                  Scheduled: {new Date(reminder.scheduledAt).toLocaleString()}
                                </div>
                              </div>
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                PENDING
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent History + Weekly Chart */}
                    {patientHistory.length > 0 && (
                      <>
                        <div className="card mb-6">
                          <h3 className="text-lg font-semibold mb-4">Weekly Adherence</h3>
                          <div style={{ width: '100%', height: 220 }}>
                            <ResponsiveContainer>
                              <BarChart data={computeWeeklyAdherence(patientHistory)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="taken" fill="var(--brand)" name="Taken" />
                                <Bar dataKey="missed" fill="#ef4444" name="Missed" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="card">
                          <h3 className="text-lg font-semibold mb-4">Recent History</h3>
                          <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {patientHistory.slice(0, 10).map((h) => (
                              <div key={h.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <div className="text-sm font-medium">
                                    {h.reminder?.medicine?.name || 'Medicine'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(h.timestamp).toLocaleString()}
                                  </div>
                                </div>
                                <span
                                  className={`px-2 py-1 text-xs rounded font-medium ${
                                    h.status === 'TAKEN'
                                      ? 'bg-green-100 text-green-800'
                                      : h.status === 'MISSED'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {h.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="lg:col-span-2 card text-center py-12">
                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600 font-medium">Select a patient to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ChatWidget />
    </>
  )
}
