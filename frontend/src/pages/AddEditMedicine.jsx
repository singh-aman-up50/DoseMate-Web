import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// Layout is provided at route-level in App.jsx; remove page-level wrapper
import api from '../api/axios'

const AddEditMedicine = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    name: '',
    dosage: '',
    frequency: 'DAILY',
    startDate: '',
    endDate: '',
    reminderTimes: []
  })
  const [reminderTime, setReminderTime] = useState('')

  useEffect(() => {
    if (id) fetchMedicine()
  }, [id])

  const fetchMedicine = async () => {
    try {
      const response = await api.get(`/medicines/${id}`)
      setForm(response.data)
    } catch (err) {
      setError('Failed to load medicine')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleAddReminderTime = () => {
    if (reminderTime && !form.reminderTimes.includes(reminderTime)) {
      setForm((f) => ({ ...f, reminderTimes: [...f.reminderTimes, reminderTime] }))
      setReminderTime('')
    }
  }

  const handleRemoveReminderTime = (time) => {
    setForm((f) => ({ ...f, reminderTimes: f.reminderTimes.filter((t) => t !== time) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (id) await api.put(`/medicines/${id}`, form)
      else await api.post('/medicines', form)
      setSuccess('Medicine saved successfully')
      setTimeout(() => navigate('/medicines'), 700)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save medicine')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-0 py-8" style={{ background: 'linear-gradient(180deg, #a7f3d0 0%, #ffffff 55%, #ccfbf1 100%)', backgroundAttachment: 'fixed' }}>
      <div className="w-full mx-0 px-3 sm:px-4 lg:px-6">
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">{id ? 'Edit Medicine' : 'Add New Medicine'}</h2>
              <div className="space-x-2">
                <button className="btn-secondary" onClick={() => navigate('/medicines')}>Back</button>
              </div>
            </div>

            {error && <div className="mb-4 text-red-600">{error}</div>}
            {success && <div className="mb-4 text-green-600">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand"
                    placeholder="e.g., Paracetamol"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                  <input
                    name="dosage"
                    value={form.dosage}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand"
                    placeholder="e.g., 500mg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select name="frequency" value={form.frequency} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date (optional)</label>
                  <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Time</label>
                  <div className="flex gap-2">
                    <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="border rounded px-3 py-2" />
                    <button type="button" onClick={handleAddReminderTime} className="btn-primary">Add</button>
                  </div>
                </div>
              </div>

              {form.reminderTimes.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Reminder Times</p>
                  <div className="flex flex-wrap gap-2">
                    {form.reminderTimes.map((time) => (
                      <button key={time} type="button" onClick={() => handleRemoveReminderTime(time)} className="px-3 py-1 bg-gray-100 rounded">
                        {time} ✕
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => navigate('/medicines')} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : 'Save Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  )
}

export default AddEditMedicine
