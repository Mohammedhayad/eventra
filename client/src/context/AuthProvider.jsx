import { useState, useEffect } from 'react'
import api from '../services/api'
import { AuthContext } from './AuthContext'
import {
  getToken,
  getSavedUser,
  saveSession,
  updateSavedUser,
  clearSession,
} from '../utils/storage'

function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser)
  const [loading, setLoading] = useState(() => Boolean(getToken()))

  // On page load, ask the backend if the saved token is still valid
  useEffect(() => {
    if (!getToken()) return

    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.user)
        updateSavedUser(res.data.user)
      })
      .catch((err) => {
        // Log out only if the token was rejected (not if the server is just offline)
        if (err.response?.status === 401) {
          clearSession()
          setUser(null)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (token, userData, remember = true) => {
    saveSession(token, userData, remember)
    setUser(userData)
  }

  const logout = () => {
    clearSession()
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