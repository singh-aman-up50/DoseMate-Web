import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// Layout is provided at route-level in App.jsx; remove page-level wrapper
import Card from '../components/Card'
import Button from '../components/Button'
import { Edit as EditIcon, Trash2 as DeleteIcon, Plus as AddIcon } from 'lucide-react'
import api from '../api/axios'

const MedicineList = () => {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    fetchMedicines()
  }, [])

  const fetchMedicines = async () => {
    try {
      setError('')
      const response = await api.get('/medicines')
      setMedicines(response.data)
    } catch (err) {
      setError('Failed to fetch medicines. Please try again.')
      console.error('Failed to fetch medicines:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/medicines/${selectedId}`)
      setMedicines(medicines.filter((m) => m.id !== selectedId))
      setOpenDelete(false)
    } catch (err) {
      setError('Failed to delete medicine')
      console.error('Delete failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-0">Loading...</div>
    )
  }

  return (
    <>
      <div className="min-h-screen w-full mx-0 px-3 sm:px-4 lg:px-6 py-8" style={{ background: 'linear-gradient(180deg, #a7f3d0 0%, #ffffff 55%, #ccfbf1 100%)', backgroundAttachment: 'fixed' }}>
        <div className="w-full mx-0 px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold">My Medicines</h2>
              <p className="text-sm text-gray-600">Manage your active medications</p>
            </div>
            <Link to="/medicines/add">
              <Button variant="primary" className="inline-flex items-center gap-2">
                <AddIcon size={16} />
                Add Medicine
              </Button>
            </Link>
          </div>

          {error && <div className="text-red-600 mb-4">{error}</div>}

          {medicines.length === 0 ? (
            <Card>
              <div className="text-center py-10">
                <p className="text-gray-600">No medicines added yet. Add one to get started!</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicines.map((med) => (
                <Card key={med.id} className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{med.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Dosage: <span className="font-medium text-gray-800">{med.dosage}</span></p>
                    <p className="text-sm text-gray-600">Frequency: <span className="font-medium text-gray-800">{med.frequency}</span></p>
                    <p className="text-sm text-gray-500 mt-2">{med.endDate ? `Ends: ${med.endDate}` : 'Ongoing'}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Link to={`/medicines/edit/${med.id}`} className="w-full">
                      <Button variant="secondary" className="w-full inline-flex items-center justify-center gap-2">
                        <EditIcon size={14} /> Edit
                      </Button>
                    </Link>
                    <button onClick={() => { setSelectedId(med.id); setOpenDelete(true) }} className="w-full">
                      <Button variant="primary" className="w-full bg-gradient-to-r from-red-500 to-red-600"> <DeleteIcon size={14} /> Delete</Button>
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Delete confirm modal */}
          {openDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setOpenDelete(false)}></div>
              <div className="bg-white rounded-2xl p-6 z-10 w-11/12 max-w-md">
                <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
                <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this medicine? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setOpenDelete(false)} className="btn-secondary px-4 py-2 rounded-lg">Cancel</button>
                  <button onClick={handleDeleteConfirm} className="btn-primary px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600">Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MedicineList
