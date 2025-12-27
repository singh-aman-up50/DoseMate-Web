import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CustomThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MedicineList from './pages/MedicineList'
import AddEditMedicine from './pages/AddEditMedicine'
import History from './pages/History'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import Reminders from './pages/Reminders'
import CaregiverDashboard from './pages/CaregiverDashboard'
import ManageCaregivers from './pages/ManageCaregivers'
import AcceptCaregiverInvite from './pages/AcceptCaregiverInvite'
import CaregiverProfile from './pages/CaregiverProfile'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CustomThemeProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/caregiver/accept/:code" element={<AcceptCaregiverInvite />} />
            <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/caregiver/dashboard" element={<ProtectedRoute><Layout><CaregiverDashboard /></Layout></ProtectedRoute>} />
            <Route path="/caregiver/profile" element={<ProtectedRoute><Layout><CaregiverProfile /></Layout></ProtectedRoute>} />
            <Route path="/medicines" element={<ProtectedRoute><Layout><MedicineList /></Layout></ProtectedRoute>} />
            <Route path="/medicines/add" element={<ProtectedRoute><Layout><AddEditMedicine /></Layout></ProtectedRoute>} />
            <Route path="/medicines/edit/:id" element={<ProtectedRoute><Layout><AddEditMedicine /></Layout></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><Layout><History /></Layout></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
            <Route path="/reminders" element={<ProtectedRoute><Layout><Reminders /></Layout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
            <Route path="/caregivers" element={<ProtectedRoute><Layout><ManageCaregivers /></Layout></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </CustomThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
