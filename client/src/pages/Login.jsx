import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { isCollegeEmail, COLLEGE_EMAIL_MESSAGE } from '../utils/validators'
import './Auth.css'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!isCollegeEmail(formData.email)) {
      setError(COLLEGE_EMAIL_MESSAGE)
      return
    }

    if (!formData.password) {
      setError('Please enter your password')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/auth/login', formData)
      setSuccess(`Login successful. Welcome, ${response.data.user.name}!`)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not reach the server. Is it running?'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Login with your college mail id.</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">College email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@bmsit.in"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login