import React, { useEffect, useState } from 'react'
// Layout is provided at route-level in App.jsx; remove page-level wrapper
import Card from '../components/Card'
import Button from '../components/Button'
import { api } from '../api/axios'

export default function Reminders() {
  const [pending, setPending] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAll()

    // WebSocket for reminder events
    const ws = new WebSocket('ws://localhost:8080/ws/reminders')
    ws.onopen = () => console.log('Reminders WS connected')
    ws.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data)
        console.log('Reminder event:', payload)
        // Refresh lists
        fetchAll()
        // Show browser notification
        if (window.Notification && Notification.permission === 'granted') {
          const title = payload.medicineName || 'Reminder'
          const body = payload.message || `Time to take ${title}`
          new Notification(title, { body })
        }
      } catch (e) {
        console.error('WS parse error', e)
      }
    }
    ws.onerror = (err) => console.error('WS error', err)
    return () => ws.close()
  }, [])

  // Request permission for notifications
  useEffect(() => {
    if (window.Notification && Notification.permission === 'default') Notification.requestPermission()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [p, u] = await Promise.all([api.get('/reminders/pending'), api.get('/reminders/upcoming')])
      setPending(p.data)
      setUpcoming(u.data)
    } catch (err) {
      console.error('Failed to fetch reminders', err)
      setError('Failed to load reminders')
    } finally {
      setLoading(false)
    }
  }

  const markTaken = async (id) => {
    try {
      setPending((prev) => prev.filter((r) => r.id !== id))
      await api.put(`/reminders/${id}/status`, { status: 'TAKEN' })
      fetchAll()
    } catch (err) {
      console.error('Mark taken failed', err)
      setError('Failed to mark taken')
      fetchAll()
    }
  }

  const snooze = async (id) => {
    // kept for compatibility but replaced by modal flow
    openSnoozeModal(id)
  }

  // Snooze modal state and handlers
  const [snoozeModalOpen, setSnoozeModalOpen] = useState(false)
  const [snoozeId, setSnoozeId] = useState(null)
  const [snoozeMinutes, setSnoozeMinutes] = useState('10')

  const openSnoozeModal = (id) => {
    setSnoozeId(id)
    setSnoozeMinutes('10')
    setSnoozeModalOpen(true)
  }

  const closeSnoozeModal = () => {
    setSnoozeModalOpen(false)
    setSnoozeId(null)
  }

  const confirmSnooze = async () => {
    const minutes = parseInt(snoozeMinutes, 10) || 10
    try {
      await api.put(`/reminders/${snoozeId}/snooze`, { minutes })
      closeSnoozeModal()
      fetchAll()
    } catch (err) {
      console.error('Snooze failed', err)
      setError('Failed to snooze reminder')
    }
  }

  if (loading) return (
    <div className="min-h-screen p-8 flex items-center justify-center">Loading reminders...</div>
  )

  return (
    <>
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-heading font-bold">Reminders</h1>
            <p className="text-sm text-gray-600">Manage pending and upcoming reminders</p>
          </div>
          {error && <div className="mb-4 text-red-600">{error}</div>}

          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Pending Reminders</h2>
            {pending.length === 0 ? (
              <div className="text-gray-600">No pending reminders.</div>
            ) : (
              <ul className="space-y-3">
                {pending.map((r) => (
                  <li key={r.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-xl border">
                    <div>
                      <div className="font-semibold text-gray-900">{r.medicineName}</div>
                      <div className="text-sm text-gray-500 mt-1">Scheduled: {new Date(r.scheduledAt).toLocaleString()}</div>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-4 flex items-center gap-2 w-full sm:w-auto">
                      <button onClick={() => openSnoozeModal(r.id)} className="w-full sm:w-auto">
                        <Button variant="secondary">Snooze</Button>
                      </button>
                      <button onClick={() => markTaken(r.id)} className="w-full sm:w-auto">
                        <Button variant="primary">Mark Taken</Button>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-3">Upcoming Reminders</h2>
            {upcoming.length === 0 ? (
              <div className="text-gray-600">No upcoming reminders.</div>
            ) : (
              <ul className="space-y-2">
                {upcoming.map((r) => (
                  <li key={r.id} className="flex items-center justify-between bg-white p-3 rounded-md border">
                    <div>
                      <div className="font-semibold">{r.medicineName}</div>
                      <div className="text-sm text-gray-500">At: {new Date(r.scheduledAt).toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-gray-600">{r.status}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
      {/* Snooze Modal */}
      {snoozeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeSnoozeModal}></div>
          <div className="bg-white rounded-lg shadow-lg z-10 w-[320px] p-4">
            <h3 className="text-lg font-semibold mb-2">Snooze Reminder</h3>
            <p className="text-sm text-gray-600 mb-3">Enter minutes to snooze the reminder.</p>
            <input type="number" min="1" value={snoozeMinutes} onChange={(e) => setSnoozeMinutes(e.target.value)} className="w-full border rounded px-3 py-2 mb-4" />
            <div className="flex justify-end gap-2">
              <button onClick={closeSnoozeModal} className="btn-secondary">Cancel</button>
              <button onClick={confirmSnooze} className="btn-primary">Snooze</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
