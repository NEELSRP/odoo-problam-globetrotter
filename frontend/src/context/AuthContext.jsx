import { createContext, useContext, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('gt_user')
    return stored ? JSON.parse(stored) : null
  })

  const persist = (token, userData) => {
    localStorage.setItem('gt_token', token)
    localStorage.setItem('gt_user', JSON.stringify(userData))
    setUser(userData)
  }

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    persist(data.access_token, data.user)
  }

  const signup = async (name, email, password) => {
    const { data } = await api.post('/auth/signup', { name, email, password })
    persist(data.access_token, data.user)
  }

  const logout = () => {
    localStorage.removeItem('gt_token')
    localStorage.removeItem('gt_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
