import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import useAuth from '../hooks/useAuth'

function StudentDashboard() {
  const { user } = useAuth()
  const [confirmedCount, setConfirmedCount] = useState(null)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await api.get('/registrations/my')
        setConfirmedCount(
          response.data.registrations.filter(
            (registration) => registration.registrationStatus === 'confirmed'
          ).length
        )
      } catch {
        setConfirmedCount(null)
      }
    }

    fetchCount()
  }, [])

  return (
    <div>
      <h2>Student Dashboard</h2>
      <p style={{ marginBottom: '20px' }}>Welcome, {user.name}!</p>

      <div className="features">
        <div className="card">
          <h3>Your details</h3>
          <p>Email: {user.email}</p>
          <p>College ID: {user.collegeId || 'Not added'}</p>
        </div>
        <div className="card">
          <h3>My registrations</h3>
          <p>
            {confirmedCount === null
              ? 'Loading...'
              : `You are registered for ${confirmedCount} event(s).`}
          </p>
          <p style={{ marginTop: '8px' }}>
            <Link to="/my-registrations">View all registrations →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard