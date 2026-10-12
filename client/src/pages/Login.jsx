import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Lock } from 'lucide-react'
import api from '../services/api'
import useAuth from '../hooks/useAuth'
import Logo from '../components/Logo'
import AuthInput from '../components/AuthInput'
import { isCollegeEmail, COLLEGE_EMAIL_MESSAGE } from '../utils/validators'
import './Auth.css'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

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
      const { token, user } = response.data

      login(token, user, remember)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
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
    <div className="auth-screen">
      <div className="auth-screen-inner">
        <Link to="/" className="auth-back" aria-label="Back">
          <ArrowLeft size={22} />
        </Link>

        <div className="auth-brand">
          <Logo size="lg" stacked />
        </div>

        <h2>Welcome back!</h2>
        <p className="auth-subtitle">Login to your account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <AuthInput
            icon={Mail}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="College email (name@bmsit.in)"
            autoComplete="email"
          />

          <AuthInput
            icon={Lock}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="current-password"
          />

          <div className="auth-row">
            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login