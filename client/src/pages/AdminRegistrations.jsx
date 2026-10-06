import { useState, useEffect } from 'react'
import api from '../services/api'
import './Admin.css'

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

const paymentLabel = {
  not_required: 'Free',
  paid: 'Paid',
  pending: 'Pending',
}

// Stops spreadsheet programs from running text like "=SUM(...)" as a formula
const safeCell = (value) => {
  const text = String(value ?? '')
  const protectedText = /^[=+\-@]/.test(text) ? `'${text}` : text
  return `"${protectedText.replace(/"/g, '""')}"`
}

function AdminRegistrations() {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events')
        setEvents(response.data.events)
      } catch {
        // The event filter is optional, so we ignore this error
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await api.get('/admin/registrations', {
          params: selectedEvent ? { eventId: selectedEvent } : {},
        })
        setRegistrations(response.data.registrations)
        setError('')
      } catch {
        setError('Could not load registrations. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrations()
  }, [selectedEvent])

  const handleFilterChange = (e) => {
    setLoading(true)
    setSelectedEvent(e.target.value)
  }

  const confirmedCount = registrations.filter(
    (registration) => registration.registrationStatus === 'confirmed'
  ).length
  const checkedInCount = registrations.filter(
    (registration) => registration.checkedIn
  ).length

  const downloadCsv = () => {
    const header = [
      'Name',
      'Email',
      'College ID',
      'Event',
      'Payment',
      'Status',
      'Checked in',
      'Registered on',
    ]

    const rows = registrations.map((registration) => [
      registration.student.name,
      registration.student.email,
      registration.student.collegeId || '',
      registration.event.title,
      paymentLabel[registration.paymentStatus],
      registration.registrationStatus,
      registration.checkedIn ? 'Yes' : 'No',
      formatDate(registration.registeredAt),
    ])

    const csv = [header, ...rows]
      .map((row) => row.map(safeCell).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'eventra-registrations.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <h2>Registrations</h2>
          <p className="admin-subtitle">
            {registrations.length} registration(s) · {confirmedCount} confirmed ·{' '}
            {checkedInCount} checked in
          </p>
        </div>
      </div>

      <div className="admin-toolbar">
        <select
          className="admin-select"
          value={selectedEvent}
          onChange={handleFilterChange}
        >
          <option value="">All events</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title}
            </option>
          ))}
        </select>

        <button
          className="csv-btn"
          onClick={downloadCsv}
          disabled={registrations.length === 0}
        >
          Download CSV
        </button>
      </div>

      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      {loading && <p>Loading registrations...</p>}

      {!loading && !error && registrations.length === 0 && (
        <div className="table-wrapper">
          <p className="empty-state">No registrations found.</p>
        </div>
      )}

      {!loading && registrations.length > 0 && (
        <div className="table-wrapper">
          <table className="events-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>College ID</th>
                <th>Event</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Checked in</th>
                <th>Registered on</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration._id}>
                  <td>
                    {registration.student.name}
                    <br />
                    <small>{registration.student.email}</small>
                  </td>
                  <td>{registration.student.collegeId || '-'}</td>
                  <td>{registration.event.title}</td>
                  <td>{paymentLabel[registration.paymentStatus]}</td>
                  <td>{registration.registrationStatus}</td>
                  <td>{registration.checkedIn ? '✓ Yes' : 'No'}</td>
                  <td>{formatDate(registration.registeredAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminRegistrations