import React, { useEffect, useState } from 'react'
import { api } from '../api/axios'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import { Calendar, Download, Filter } from 'lucide-react'
// Layout is provided at route-level in App.jsx; remove page-level wrapper
import Card from '../components/Card'
import Button from '../components/Button'

export default function Reports() {
  const [timeRange, setTimeRange] = useState('week') // week, month, all
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [medicines, setMedicines] = useState([])
  const [adherenceData, setAdherenceData] = useState([])
  const [overallStats, setOverallStats] = useState(null)
  const [medicineStats, setMedicineStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [timeRange, selectedMedicine])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const [medsRes, statsRes] = await Promise.all([
        api.get('/medicines'),
        api.get('/history/stats')
      ])
      
      setMedicines(medsRes.data)
      setOverallStats(statsRes.data)
      // Fetch per-medicine stats
      const meds = medsRes.data || []
      const statsCalls = meds.map((m) => api.get(`/history/stats/medicine/${m.id}`).then(r => ({ id: m.id, data: r.data })).catch(() => ({ id: m.id, data: null })))
      const statsResults = await Promise.all(statsCalls)
      const statsMap = {}
      statsResults.forEach((r) => { if (r?.id) statsMap[r.id] = r.data })
      setMedicineStats(statsMap)

      // Fetch history for adherence trends
      const historyRes = await api.get('/history/stats/weekly')
      setAdherenceData(historyRes.data)
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = () => {
    // Simple printable report: open new window and call print
    const content = document.getElementById('reports-print-area')
    if (!content) return
    const w = window.open('', '_blank')
    w.document.write('<html><head><title>Adherence Report</title>')
    w.document.write('<style>body{font-family:Arial,sans-serif;padding:20px}</style>')
    w.document.write('</head><body>')
    w.document.write(content.innerHTML)
    w.document.write('</body></html>')
    w.document.close()
    w.print()
    w.close()
  }

  const handleExportCSV = () => {
    const headers = ['Medicine', 'Total', 'Taken', 'Missed', 'AdherenceRate']
    const rows = [headers.join(',')]
    medicines.forEach((m) => {
      const s = medicineStats[m.id] || {}
      const total = s.total || 0
      const taken = s.taken || 0
      const missed = s.missed || 0
      const rate = s.adherenceRate || ''
      rows.push([`"${m.name.replace(/"/g,'""') }"`, total, taken, missed, rate].join(','))
    })
    const csvContent = rows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'medicine_adherence_report.csv'
    a.click()
  }

  if (loading) {
    return <div className="text-center py-8">Loading reports...</div>
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Adherence Reports</h1>
            <p className="text-gray-600">Track your medication adherence trends and patterns</p>
          </div>

          {/* Controls */}
          <Card className="mb-8">
            <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="all">All Time</option>
                </select>

                <select
                  value={selectedMedicine || ''}
                  onChange={(e) => setSelectedMedicine(e.target.value ? parseInt(e.target.value) : null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Medicines</option>
                  {medicines.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button onClick={handleExportCSV}>
                  <Button variant="primary" className="flex items-center gap-2"><Download size={16} /> Export CSV</Button>
                </button>
                <button onClick={handleExportPDF}>
                  <Button variant="secondary" className="flex items-center gap-2"><Download size={16} /> Export PDF</Button>
                </button>
              </div>
            </div>
            </div>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <p className="text-gray-600 text-sm mb-2">Adherence Rate</p>
              <p className="text-3xl font-bold text-green-600">{overallStats?.adherenceRate || '0%'}</p>
            </Card>
            <Card className="p-6">
              <p className="text-gray-600 text-sm mb-2">Doses Taken</p>
              <p className="text-3xl font-bold text-blue-600">{overallStats?.taken || 0}</p>
            </Card>
            <Card className="p-6">
              <p className="text-gray-600 text-sm mb-2">Doses Missed</p>
              <p className="text-3xl font-bold text-red-600">{overallStats?.missed || 0}</p>
            </Card>
            <Card className="p-6">
              <p className="text-gray-600 text-sm mb-2">Total Reminders</p>
              <p className="text-3xl font-bold text-purple-600">{overallStats?.totalReminders || 0}</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Adherence Trend */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={adherenceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="taken" fill="#10b981" name="Taken" />
                  <Bar dataKey="total" fill="#e5e7eb" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={adherenceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="percentage" stroke="#3b82f6" name="Percentage" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Statistics Table */}
          <div id="reports-print-area" className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Medicine-wise Adherence</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="table-header">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Medicine</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Taken</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Missed</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Adherence Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine) => {
                    const s = medicineStats[medicine.id] || {}
                    return (
                      <tr key={medicine.id} className="border-t">
                        <td className="px-6 py-4 text-sm text-gray-900">{medicine.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{s.total ?? 0}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{s.taken ?? 0}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{s.missed ?? 0}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded ${((s.adherenceRate||'')+'').includes('%') && parseFloat((s.adherenceRate||'').toString())<75 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {s.adherenceRate ?? '-'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
