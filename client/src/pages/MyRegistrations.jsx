import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import './MyRegistrations.css'

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await api.get('/registrations/my')
        setRegistrations(response.data.registrations)
      } catch {
        setError('Could not load your registrations. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrations()
  }, [])

  const paymentLabel = (registration) => {
    if (registration.paymentStatus === 'paid') {
      return `Paid ₹${registration.event.registrationFee}`
    }
    if (registration.paymentStatus === 'pending') {
      return 'Payment pending'
    }
    return 'Free event'
  }

  return (
    <div>
      <h2>My Registrations</h2>

      {loading && <p>Loading your registrations...</p>}
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}

      {!loading && !error && registrations.length === 0 && (
        <p style={{ marginTop: '12px' }}>
          You haven't registered for any events yet.{' '}
          <Link to="/events">Browse events</Link>
        </p>
      )}

      <div className="registration-list">
        {registrations.map((registration) => {
          const event = registration.event
          const isConfirmed = registration.registrationStatus === 'confirmed'

          return (
            <div className="registration-card" key={registration._id}>
              <div className="registration-info">
                <h3>{event.title}</h3>
                <p className="event-meta">📅 {formatDate(event.date)} · {event.time}</p>
                <p className="event-meta">📍 {event.venue}</p>
                <p className="event-meta">
                  Registered on {formatDate(registration.registeredAt)}
                </p>
              </div>

              <div className="registration-status">
                <span className={isConfirmed ? 'badge badge-free' : 'badge badge-paid'}>
                  {isConfirmed ? 'Confirmed' : 'Payment pending'}
                </span>
                <span className="status-line">{paymentLabel(registration)}</span>
                {registration.checkedIn && (
                  <span className="status-line">✓ Checked in</span>
                )}
                {isConfirmed ? (
                  <Link to={`/registrations/${registration._id}`} className="card-btn">
                    View QR pass
                  </Link>
                ) : (
                  <Link to={`/events/${event._id}`} className="card-btn">
                    Complete payment
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyRegistrations