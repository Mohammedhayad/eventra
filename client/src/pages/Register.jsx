import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, GraduationCap, Mail, Lock } from 'lucide-react'
import api from '../services/api'
import Logo from '../components/Logo'
import AuthInput from '../components/AuthInput'
import { isCollegeEmail, COLLEGE_EMAIL_MESSAGE } from '../utils/validators'
import './Auth.css'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    collegeId: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
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

    if (!formData.name.trim()) {
      setError('Please enter your name')
      return
    }

    if (!isCollegeEmail(formData.email)) {
      setError(COLLEGE_EMAIL_MESSAGE)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      await api.post('/auth/register', {
        name: formData.name,
        collegeId: formData.collegeId,
        email: formData.email,
        password: formData.password,
      })
      setSuccess('Account created! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
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

        <h2>Create your account</h2>
        <p className="auth-subtitle">Use your college mail id to sign up</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <AuthInput
            icon={User}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full name"
            autoComplete="name"
          />

          <AuthInput
            icon={GraduationCap}
            name="collegeId"
            value={formData.collegeId}
            onChange={handleChange}
            placeholder="College ID / USN (optional)"
          />

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
            placeholder="Password (at least 6 characters)"
            autoComplete="new-password"
          />

          <AuthInput
            icon={Lock}
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            autoComplete="new-password"
          />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register