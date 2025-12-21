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

  const register = async (firstName, lastName, email, password, confirmPassword, phone, address, age) => {
    const response = await api.post('/auth/register', {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone: phone || null,
      address: address || null,
      age: age ? parseInt(age) : null
    })
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
