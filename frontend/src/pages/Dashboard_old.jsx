import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { api } from '../api/axios'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Pill, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
// Layout is provided at route-level in App.jsx; remove page-level wrapper

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
    { name: 'Taken', value: stats?.taken || 0, fill: 'var(--brand)' },
    { name: 'Missed', value: stats?.missed || 0, fill: '#ef4444' }
  ]

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'User')

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Premium Header Section */}
          <div className="mb-10 md:mb-12 lg:mb-14 relative">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-200 to-transparent rounded-full opacity-20 blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <div>
                  <div className="inline-block mb-3">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 text-xs font-bold rounded-full">DASHBOARD</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">Welcome, {displayName.toUpperCase()}</h1>
                  <p className="text-gray-600 text-sm md:text-base font-medium">📊 Track your medication adherence and manage your health</p>
                </div>
                <div>
                  <button onClick={() => navigate('/medicines/add')} className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-105 text-sm md:text-base" style={{boxShadow: '0 10px 30px rgba(0,150,101,0.2)'}}>
                    ✚ Add Medicine
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12 lg:mb-14">
            {statCards.map((card, idx) => {
              const Icon = card.icon
              const gradients = [
                'from-green-500 to-emerald-600',
                'from-blue-500 to-cyan-600',
                'from-orange-500 to-amber-600',
                'from-purple-500 to-pink-600'
              ]
              const bgGradients = [
                'from-green-50 to-emerald-50',
                'from-blue-50 to-cyan-50',
                'from-orange-50 to-amber-50',
                'from-purple-50 to-pink-50'
              ]
              return (
                <div key={idx} className={`bg-gradient-to-br ${bgGradients[idx]} rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs md:text-sm font-bold uppercase tracking-wider">{card.label}</p>
                      <p className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">{card.value}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${gradients[idx]} p-4 rounded-xl text-white shadow-lg`}>
                      <Icon size={28} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Premium Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12 lg:mb-14">
            {/* Weekly Adherence */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Weekly Adherence</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{backgroundColor: '#fff', border: '2px solid var(--brand)', borderRadius: '12px'}} />
                  <Legend />
                  <Bar dataKey="taken" fill="var(--brand)" name="Taken" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="total" fill="#e0f2fe" name="Total" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Adherence Pie Chart */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
                  <CheckCircle className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Overall Status</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#fff', border: '2px solid var(--brand)', borderRadius: '12px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Reminders Section */}
          {pendingReminders.length > 0 && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-red-100 to-red-50 rounded-lg">
                  <AlertCircle className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">⏰ Upcoming Reminders</h3>
              </div>
              <div className="space-y-3">
                {pendingReminders.slice(0, 5).map((reminder) => (
                  <div key={reminder.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:shadow-md transition-all duration-300 group">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg">{reminder.medicineName}</p>
                      <p className="text-sm text-gray-600 mt-1">⏱️ Scheduled: <span className="font-semibold text-amber-600">{new Date(reminder.scheduledAt).toLocaleTimeString()}</span></p>
                    </div>
                    <button onClick={() => markTaken(reminder.id)} className="mt-3 sm:mt-0 sm:ml-4 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/40 transition-all duration-300 transform group-hover:scale-105 w-full sm:w-auto" style={{ boxShadow: '0 4px 15px rgba(0,150,101,0.2)' }}>
                      ✓ Mark Taken
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
