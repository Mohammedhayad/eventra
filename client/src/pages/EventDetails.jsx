import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../services/api'
import useAuth from '../hooks/useAuth'
import './Auth.css'
import './EventDetails.css'

function EventDetails() {
  const { id } = useParams()
  const { user } = useAuth()

  const [event, setEvent] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const eventResponse = await api.get(`/events/${id}`)
        setEvent(eventResponse.data.event)

        if (user?.role === 'student') {
          const registrationsResponse = await api.get('/registrations/my')
          setIsRegistered(
            registrationsResponse.data.registrations.some(
              (registration) => registration.event._id === id
            )
          )
        }
      } catch (err) {
        setError(
          err.response?.status === 404
            ? 'Event not found'
            : 'Could not load this event. Please try again later.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, user])

  const handleRegister = async () => {
    setError('')
    setMessage('')

    try {
      setRegistering(true)
      await api.post(`/events/${id}/register`)
      setIsRegistered(true)
      setMessage('You are registered for this event!')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not register. Please try again.'
      )
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return <p>Loading event...</p>
  }

  if (!event) {
    return (
      <div>
        <p style={{ color: '#b91c1c', marginBottom: '12px' }}>{error}</p>
        <Link to="/events">← Back to events</Link>
      </div>
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isPast = new Date(event.date) < today
  const isFree = !event.registrationFee

  const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const renderAction = () => {
    if (isPast) {
      return <p>This event has already taken place.</p>
    }
    if (!user) {
      return (
        <Link to="/login" className="btn">
          Login to register
        </Link>
      )
    }
    if (user.role === 'admin') {
      return <p>Admins cannot register for events.</p>
    }
    if (isRegistered) {
      return (
        <div className="alert alert-success">
          ✓ You are registered for this event.
        </div>
      )
    }
    if (!isFree) {
      return (
        <button className="btn" disabled>
          Online payment coming soon
        </button>
      )
    }
    return (
      <button className="btn" onClick={handleRegister} disabled={registering}>
        {registering ? 'Registering...' : 'Register now'}
      </button>
    )
  }

  return (
    <div>
      <Link to="/events" className="back-link">← Back to events</Link>

      <div className="details-card">
        <div className="details-banner">{event.category}</div>

        <div className="details-body">
          <h2>{event.title}</h2>

          <div className="details-meta">
            <div className="meta-item">
              <span className="meta-label">Date</span>
              <span className="meta-value">{formattedDate}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Time</span>
              <span className="meta-value">{event.time}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Venue</span>
              <span className="meta-value">{event.venue}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Fee</span>
              <span className="meta-value">
                {isFree ? 'Free' : `₹${event.registrationFee}`}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Capacity</span>
              <span className="meta-value">{event.maxCapacity} seats</span>
            </div>
            {event.createdBy?.name && (
              <div className="meta-item">
                <span className="meta-label">Posted by</span>
                <span className="meta-value">{event.createdBy.name}</span>
              </div>
            )}
          </div>

          <p className="details-description">{event.description}</p>

          <div className="details-actions">
            {error && <div className="alert alert-error">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}
            {renderAction()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails