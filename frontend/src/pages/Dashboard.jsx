import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { api } from '../api/axios'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Pill, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
// Layout is provided at route-level in App.jsx; remove page-level wrapper
import ChatWidget from '../components/ChatWidget'

export default function Dashboard() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [weeklyData, setWeeklyData] = useState([])
  const [medicines, setMedicines] = useState([])
  const [pendingReminders, setPendingReminders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    // Real-time updates via WebSocket
    const ws = new WebSocket('ws://localhost:8080/ws/adherence')
    ws.onopen = () => console.log('WebSocket connected')
    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        console.log('Real-time update:', payload)
        // If it's a reminder event, refresh pending reminders and show a browser notification
        if (payload?.medicineName || payload?.type === 'REMINDER') {
          fetchPendingReminders()
          if (window.Notification && Notification.permission === 'granted') {
            const title = payload.medicineName || 'Medication Reminder'
            const body = payload.message || `Time to take your medicine: ${title}`
            new Notification(title, { body })
          }
        }
        // Adherence updates: refresh stats/weekly chart
        fetchStats()
        fetchWeeklyData()
      } catch (e) {
        console.log('WS message parse error', e)
      }
    }
    ws.onerror = (error) => console.error('WebSocket error:', error)
    return () => ws.close()
  }, [])

  const fetchDashboardData = async () => {
    try {
      await Promise.all([
        fetchStats(),
        fetchWeeklyData(),
        fetchMedicines(),
        fetchPendingReminders()
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/history/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchWeeklyData = async () => {
    try {
      const response = await api.get('/history/stats/weekly')
      setWeeklyData(response.data)
    } catch (error) {
      console.error('Error fetching weekly data:', error)
    }
  }

  const fetchMedicines = async () => {
    try {
      const response = await api.get('/medicines/active')
      setMedicines(response.data)
    } catch (error) {
      console.error('Error fetching medicines:', error)
    }
  }

  const fetchPendingReminders = async () => {
    try {
      const response = await api.get('/reminders/pending')
      setPendingReminders(response.data)
    } catch (error) {
      console.error('Error fetching pending reminders:', error)
    }
  }

  const markTaken = async (reminderId) => {
    try {
      // Optimistic UI update: remove reminder immediately
      setPendingReminders((prev) => prev.filter((r) => r.id !== reminderId))
      await api.put(`/reminders/${reminderId}/status`, { status: 'TAKEN' })
      // Refresh stats after marking taken
      fetchStats()
      // Refresh pending list to reflect server state
      fetchPendingReminders()
    } catch (error) {
      console.error('Error marking reminder taken:', error)
      // Revert optimistic update on error
      fetchPendingReminders()
      alert('Failed to mark reminder as taken. Please try again.')
    }
  }

  // Request notification permission when component mounts
  useEffect(() => {
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission().then((perm) => console.log('Notification permission:', perm))
    }
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="text-2xl">Loading...</div></div>
  }

  const statCards = [
    { label: 'Medicines', value: medicines.length, icon: Pill, color: 'bg-brand' },
    { label: 'Adherence', value: stats?.adherenceRate || '0%', icon: TrendingUp, color: 'bg-accent' },
    { label: 'Pending', value: pendingReminders.length, icon: Clock, color: 'bg-brand/80' },
    { label: 'Taken', value: stats?.taken || 0, icon: CheckCircle, color: 'bg-accent/80' }
  ]

  const pieData = [
    { name: 'Taken', value: stats?.taken || 0, fill: '#009665' },
    { name: 'Missed', value: stats?.missed || 0, fill: '#ef4444' }
  ]

  const firstNameRaw = user?.firstName || (user?.name ? user.name.split(' ')[0] : (user?.email ? user.email.split('@')[0] : 'User'))
  const firstName = String(firstNameRaw).toUpperCase()

  return (
    <>
      <div className="min-h-screen page-bg p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Hi, {firstName} <span role="img" aria-label="waving hand">👋</span></h1>
                <p className="text-gray-600">Track your medication adherence and manage your health</p>
              </div>
              <div>
                <button onClick={() => navigate('/medicines/add')} className="btn-primary">
                  Add Medicine
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((card, idx) => {
              const Icon = card.icon
              return (
                <div key={idx} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">{card.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                    </div>
                    <div className={`${card.color} p-3 rounded-full text-white`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Weekly Adherence */}
            <div className="lg:col-span-2 card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Adherence</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="taken" fill="#009665" name="Taken" />
                  <Bar dataKey="total" fill="#e5e7eb" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Adherence Pie Chart */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Overall Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Reminders */}
          {pendingReminders.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-brand" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Upcoming Reminders</h3>
              </div>
              <div className="space-y-3">
                {pendingReminders.slice(0, 5).map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-900">{reminder.medicineName}</p>
                      <p className="text-sm text-gray-600">Scheduled: {new Date(reminder.scheduledAt).toLocaleTimeString()}</p>
                    </div>
                    <button onClick={() => markTaken(reminder.id)} className="px-4 py-2 bg-brand text-white rounded-lg hover:opacity-95 transition" style={{ boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                      Mark Taken
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ChatWidget />
    </>
  )
}
