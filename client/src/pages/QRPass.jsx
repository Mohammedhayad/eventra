import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import api from '../services/api'
import useAuth from '../hooks/useAuth'
import './QRPass.css'

function QRPass() {
  const { id } = useParams()
  const { user } = useAuth()

  const [registration, setRegistration] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const response = await api.get(`/registrations/${id}`)
        setRegistration(response.data.registration)
      } catch (err) {
        setError(
          err.response?.status === 404
            ? 'Registration not found'
            : 'Could not load your pass. Please try again later.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRegistration()
  }, [id])

  if (loading) {
    return <p>Loading your pass...</p>
  }

  if (!registration) {
    return (
      <div>
        <p style={{ color: '#b91c1c', marginBottom: '12px' }}>{error}</p>
        <Link to="/my-registrations">← Back to my registrations</Link>
      </div>
    )
  }

  const event = registration.event
  const isConfirmed = registration.registrationStatus === 'confirmed'

  const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div>
      <Link to="/my-registrations" className="back-link">
        ← Back to my registrations
      </Link>

      <div className="pass-wrapper">
        <div className="pass-card">
          <div className="pass-header">
            <small>Eventra entry pass</small>
            <strong>{event.category}</strong>
          </div>

          <div className="pass-body">
            <h3>{event.title}</h3>
            <p className="event-meta">📅 {formattedDate} · {event.time}</p>
            <p className="event-meta">📍 {event.venue}</p>

            {isConfirmed ? (
              <>
                <div className="pass-qr">
                  <QRCodeSVG
                    value={registration.registrationCode}
                    size={220}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
                <p className="pass-code">{registration.registrationCode}</p>

                <div className="pass-status">
                  {registration.checkedIn ? (
                    <span className="badge badge-free">
                      ✓ Checked in at{' '}
                      {new Date(registration.checkInTime).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  ) : (
                    <span className="badge badge-paid">Not checked in yet</span>
                  )}
                </div>
              </>
            ) : (
              <div className="pass-status">
                <p style={{ marginBottom: '12px' }}>
                  Your pass will appear here once your payment is complete.
                </p>
                <Link to={`/events/${event._id}`} className="btn">
                  Complete payment
                </Link>
              </div>
            )}

            <div className="pass-holder">
              <p>Name: {user.name}</p>
              <p>College ID: {user.collegeId || 'Not added'}</p>
              <p>Show this QR code at the venue entrance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRPass