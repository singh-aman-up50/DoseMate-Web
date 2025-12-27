import React, { useEffect, useState, useRef } from 'react'
// Layout is provided at route-level in App.jsx; remove page-level wrapper
import Card from '../components/Card'
import Button from '../components/Button'
import { api } from '../api/axios'

export default function Reminders() {
  const [pending, setPending] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // Active in-app notification (only one at a time)
  const [activeNotification, setActiveNotification] = useState(null)
  const notificationTimerRef = useRef(null)
  const notificationQueueRef = useRef([])
  const pendingTimersRef = useRef({})

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
        // Prefer in-app single notification flow
        try {
          handleIncomingReminder(payload)
        } catch (e) {
          console.error('Reminder handling failed', e)
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
      // ensure pending timers are running for existing pending reminders
      if (Array.isArray(p.data)) {
        p.data.forEach((r) => {
          const id = r.id || r.reminderId
          if (id) startPendingTimer(id)
        })
      }
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
      // clear any pending/miss timer
      clearPendingTimer(id)
      clearMissTimer(id)
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
      // clear miss timer while snoozed
      clearMissTimer(snoozeId)
      clearPendingTimer(snoozeId)
      await api.put(`/reminders/${snoozeId}/snooze`, { minutes })
      closeSnoozeModal()
      fetchAll()
    } catch (err) {
      console.error('Snooze failed', err)
      setError('Failed to snooze reminder')
    }
  }

  // Audio + missed timer handling
  const missTimersRef = useRef({})
  const audioRef = useRef(null)

  const ensureAudio = () => {
    if (audioRef.current) return audioRef.current
    try {
      const a = new Audio('/alert.mp3')
      a.preload = 'auto'
      audioRef.current = a
      return a
    } catch (e) {
      audioRef.current = null
      return null
    }
  }

  const playAlert = () => {
    const a = ensureAudio()
    if (a) {
      try {
        a.currentTime = 0
        a.play().catch(() => beep())
      } catch (e) { beep() }
    } else {
      beep()
    }
  }

  // Start an in-app notification for a reminder (single active at a time)
  const handleIncomingReminder = (payload) => {
    const reminder = payload.reminder || payload
    const id = reminder.id || reminder.reminderId || reminder.reminderID
    if (!id) return
    const obj = {
      id,
      medicineName: reminder.medicineName || reminder.medicine?.name || reminder.title || 'Medicine',
      scheduledAt: reminder.scheduledAt || reminder.time || new Date().toISOString()
    }
    // If a notification is active, queue this
    if (activeNotification) {
      notificationQueueRef.current.push(obj)
      return
    }
    // Otherwise start it
    startNotification(obj)
  }

  const startNotification = (reminderObj) => {
    setActiveNotification(reminderObj)
    // Play alert continuously (or until stopped)
    playAlert()
    // Stop after 20 seconds and move to pending if still active
    notificationTimerRef.current = setTimeout(async () => {
      try {
        await api.put(`/reminders/${reminderObj.id}/status`, { status: 'PENDING' })
        // start pending->missed timer
        startPendingTimer(reminderObj.id)
      } catch (e) {
        console.error('Failed to mark pending after notification timeout', e)
      }
      // refresh lists
      fetchAll()
      stopNotification()
      processNotificationQueue()
    }, 20 * 1000)
  }

  const stopNotification = () => {
    // stop audio
    try {
      const a = audioRef.current
      if (a) {
        a.pause()
        a.currentTime = 0
      }
    } catch (e) {}
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current)
      notificationTimerRef.current = null
    }
    setActiveNotification(null)
  }

  const processNotificationQueue = () => {
    const q = notificationQueueRef.current
    if (q && q.length > 0) {
      const next = q.shift()
      notificationQueueRef.current = q
      // slight delay before starting next
      setTimeout(() => startNotification(next), 250)
    }
  }

  const beep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = 880
      o.connect(g)
      g.connect(ctx.destination)
      g.gain.value = 0.0001
      o.start()
      // ramp up quickly
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02)
      setTimeout(() => {
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1)
        o.stop(ctx.currentTime + 0.12)
        try { ctx.close() } catch (e) {}
      }, 200)
    } catch (e) {
      console.error('Beep failed', e)
    }
  }

  // pending -> missed timer: 5 minutes (300000 ms)
  const startPendingTimer = (id) => {
    if (pendingTimersRef.current[id]) return
    const t = setTimeout(async () => {
      try {
        await api.put(`/reminders/${id}/status`, { status: 'MISSED' })
        fetchAll()
      } catch (e) {
        console.error('Failed to mark missed', e)
      } finally {
        delete pendingTimersRef.current[id]
      }
    }, 5 * 60 * 1000)
    pendingTimersRef.current[id] = t
  }

  const clearPendingTimer = (id) => {
    const t = pendingTimersRef.current[id]
    if (t) {
      clearTimeout(t)
      delete pendingTimersRef.current[id]
    }
  }

  const clearMissTimer = (id) => {
    const t = missTimersRef.current[id]
    if (t) {
      clearTimeout(t)
      delete missTimersRef.current[id]
    }
  }

  if (loading) return (
    <div className="min-h-screen p-8 flex items-center justify-center">Loading reminders...</div>
  )

  return (
    <>
      <div className="min-h-screen p-0 py-8" style={{ background: 'linear-gradient(180deg, #a7f3d0 0%, #ffffff 55%, #ccfbf1 100%)', backgroundAttachment: 'fixed' }}>
        <div className="w-full mx-0 px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-heading font-bold">Reminders</h1>
              <p className="text-sm text-gray-600">Manage pending and upcoming reminders</p>
            </div>
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
                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition" style={{ background: 'linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)' }}>Snooze</button>
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
