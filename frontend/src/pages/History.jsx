import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  Grid
} from '@mui/material'
// Layout is provided at route-level in App.jsx; remove page-level wrapper
import api from '../api/axios'

const History = () => {
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({ taken: 0, missed: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await api.get('/history')
      setHistory(response.data)

      const taken = response.data.filter((h) => h.status === 'TAKEN').length
      const missed = response.data.filter((h) => h.status === 'MISSED').length
      setStats({ taken, missed })
    } catch (err) {
      console.error('Failed to fetch history:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Medicine Intake History
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="card text-center p-4">
          <p className="text-sm text-gray-600 mb-2">Taken</p>
          <p className="text-2xl font-bold text-brand">{stats.taken}</p>
        </div>
        <div className="card text-center p-4">
          <p className="text-sm text-gray-600 mb-2">Missed</p>
          <p className="text-2xl font-bold text-red-600">{stats.missed}</p>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Medicine</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.reminder?.medicine?.name || 'N/A'}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        item.status === 'TAKEN'
                          ? 'green'
                          : item.status === 'MISSED'
                          ? 'red'
                          : 'orange'
                    }}
                  >
                    {item.status}
                  </Typography>
                </TableCell>
                <TableCell>{new Date(item.recordedAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default History
