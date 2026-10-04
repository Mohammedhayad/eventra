import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import useAuth from '../hooks/useAuth'
import './Auth.css'
import './Admin.css'

function AdminDashboard() {
  const { user } = useAuth()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events')
        setEvents(response.data.events)
      } catch {
        setError('Could not load events.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      return
    }

    setError('')
    setMessage('')

    try {
      await api.delete(`/events/${id}`)
      setEvents(events.filter((event) => event._id !== id))
      setMessage('Event deleted successfully')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete the event')
    }
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  return (
    <div>
      <div className="admin-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p className="admin-subtitle">
            Welcome, {user.name}. {events.length} event(s) posted.
          </p>
        </div>
        <Link to="/admin/events/new" className="btn">+ Create Event</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      {loading && <p>Loading events...</p>}

      {!loading && events.length === 0 && !error && (
        <div className="table-wrapper">
          <p className="empty-state">
            No events yet. Click "Create Event" to post your first one.
          </p>
        </div>
      )}

      {events.length > 0 && (
        <div className="table-wrapper">
          <table className="events-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Fee</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{event.category}</td>
                  <td>{formatDate(event.date)}</td>
                  <td>{event.registrationFee ? `₹${event.registrationFee}` : 'Free'}</td>
                  <td>{event.maxCapacity}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/admin/events/${event._id}/edit`}>Edit</Link>
                      <button
                        className="link-btn-danger"
                        onClick={() => handleDelete(event._id, event.title)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard