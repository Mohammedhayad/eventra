import { useState, useEffect } from 'react'
import api from '../services/api'
import { AuthContext } from './AuthContext'

const getSavedUser = () => {
  try {
    const saved = localStorage.getItem('eventra_user')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser)
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem('eventra_token'))
  )

  // On page load, ask the backend if the saved token is still valid
  useEffect(() => {
    const token = localStorage.getItem('eventra_token')
    if (!token) return

    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.user)
        localStorage.setItem('eventra_user', JSON.stringify(res.data.user))
      })
      .catch((err) => {
        // Log out only if the token was rejected (not if the server is just offline)
        if (err.response?.status === 401) {
          localStorage.removeItem('eventra_token')
          localStorage.removeItem('eventra_user')
          setUser(null)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('eventra_token', token)
    localStorage.setItem('eventra_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('eventra_token')
    localStorage.removeItem('eventra_user')
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider