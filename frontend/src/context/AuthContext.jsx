import { createContext, useState, useEffect } from 'react'
import api from '../api/axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const register = async (firstName, lastName, email, password, confirmPassword, phone, address, age, role, caregiverMeta) => {
    const body = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone: phone || null,
      address: address || null,
      age: age ? parseInt(age) : null,
      role: role || 'ROLE_USER'
    }
    if (role === 'ROLE_CAREGIVER' && caregiverMeta) {
      body.organization = caregiverMeta.organization || null
      body.licenseNumber = caregiverMeta.licenseNumber || null
      body.specialization = caregiverMeta.specialization || null
      body.yearsExperience = caregiverMeta.yearsExperience ? parseInt(caregiverMeta.yearsExperience) : null
    }
    const response = await api.post('/auth/register', body)
    return response.data
  }

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { token, user: userData } = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
