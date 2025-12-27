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
    // Get the print area content and open in a new window for printing
    const content = document.getElementById('reports-print-area')
    if (!content) {
      alert('No content to export')
      return
    }
    const w = window.open('', '_blank')
    w.document.write('<!DOCTYPE html><html><head><title>Adherence Report</title>')
    w.document.write('<style>body{font-family:Arial,sans-serif;padding:20px;margin:0} table{width:100%;border-collapse:collapse} th,td{border:1px solid #ddd;padding:8px;text-align:left}</style>')
    w.document.write('</head><body>')
    w.document.write(content.innerHTML)
    w.document.write('</body></html>')
    w.document.close()
    setTimeout(() => {
      w.print()
      w.close()
    }, 250)
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
      <div className="min-h-screen bg-gray-50 p-0 py-8" style={{ background: 'linear-gradient(180deg, #a7f3d0 0%, #ffffff 55%, #ccfbf1 100%)', backgroundAttachment: 'fixed' }}>
        <div className="w-full mx-0 px-3 sm:px-4 lg:px-6">
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
                <Button variant="primary" onClick={handleExportCSV} className="flex items-center gap-2"><Download size={16} /> Export CSV</Button>
                <Button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition" style={{ background: 'linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)' }}><Download size={16} /> Export PDF</Button>
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
          <Card className="mt-8">
            <div id="reports-print-area">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Medicine-wise Adherence</h2>
              {medicines.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No medicines found. Add medicines to view adherence data.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl" style={{ borderRadius: '12px', border: '2px solid rgba(0,0,0,0.08)' }}>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                        <th className="px-6 py-3 text-left text-sm font-bold text-white">Medicine</th>
                        <th className="px-6 py-3 text-center text-sm font-bold text-white">Total</th>
                        <th className="px-6 py-3 text-center text-sm font-bold text-white">Taken</th>
                        <th className="px-6 py-3 text-center text-sm font-bold text-white">Missed</th>
                        <th className="px-6 py-3 text-center text-sm font-bold text-white">Adherence Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.map((medicine, idx) => {
                        const s = medicineStats[medicine.id] || {}
                        const taken = s.taken || 0
                        const missed = s.missed || 0
                        // Calculate total from taken + missed if not provided or is 0
                        const total = (s.total && s.total > 0) ? s.total : (taken + missed)
                        const adherenceRate = s.adherenceRate || 'N/A'
                        const rateNum = typeof adherenceRate === 'string' ? parseInt(adherenceRate) : adherenceRate
                        // Alternate BEIGE and PINK rows
                        const rowBg = idx % 2 === 0 ? 'bg-amber-50' : 'bg-pink-50'
                        const rowBorder = idx % 2 === 0 ? 'border-amber-200' : 'border-pink-200'
                        return (
                          <tr key={medicine.id} className={`${rowBg} border-b-2 ${rowBorder} hover:shadow-sm transition`}>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{medicine.name}</td>
                            <td className="px-6 py-4 text-center text-sm text-gray-700 font-medium">{total}</td>
                            <td className="px-6 py-4 text-center text-sm text-green-700 font-semibold">{taken}</td>
                            <td className="px-6 py-4 text-center text-sm text-red-700 font-semibold">{missed}</td>
                            <td className="px-6 py-4 text-center text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                isNaN(rateNum) ? 'bg-gray-100 text-gray-600' :
                                rateNum >= 90 ? 'bg-green-200 text-green-900' :
                                rateNum >= 75 ? 'bg-yellow-200 text-yellow-900' :
                                'bg-red-200 text-red-900'
                              }`}>
                                {adherenceRate}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
