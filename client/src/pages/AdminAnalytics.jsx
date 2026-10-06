import { useState, useEffect } from 'react'
import api from '../services/api'
import './Admin.css'

const formatMoney = (amount) => `₹${amount.toLocaleString('en-IN')}`

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

function AdminAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/admin/analytics')
        setData(response.data)
      } catch {
        setError('Could not load analytics. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return <p>Loading analytics...</p>
  }

  if (!data) {
    return <p style={{ color: '#b91c1c' }}>{error}</p>
  }

  const { totals, byCategory, events } = data

  const maxRegistrations = Math.max(
    ...byCategory.map((item) => item.registrations),
    1
  )

  const checkInRate = totals.registrations
    ? Math.round((totals.checkedIn / totals.registrations) * 100)
    : 0

  const stats = [
    { label: 'Total users', value: totals.users, sub: `${totals.admins} admin(s)` },
    { label: 'Students', value: totals.students },
    { label: 'Events', value: totals.events, sub: `${totals.upcomingEvents} upcoming` },
    { label: 'Registrations', value: totals.registrations, sub: 'confirmed only' },
    { label: 'Checked in', value: totals.checkedIn, sub: `${checkInRate}% attendance` },
    { label: 'Revenue', value: formatMoney(totals.revenue), sub: 'paid registrations' },
  ]

  return (
    <div>
      <div className="admin-header">
        <div>
          <h2>Analytics</h2>
          <p className="admin-subtitle">How students are engaging with campus events.</p>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            {stat.sub && <div className="stat-sub">{stat.sub}</div>}
          </div>
        ))}
      </div>

      <div className="panel">
        <h3>Registrations by category</h3>
        {byCategory.length === 0 && <p>No data yet.</p>}
        {byCategory.map((item) => (
          <div className="bar-row" key={item.category}>
            <span>{item.category}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${(item.registrations / maxRegistrations) * 100}%` }}
              />
            </div>
            <span>{item.registrations}</span>
          </div>
        ))}
      </div>

      <div className="panel">
        <h3>Event performance</h3>
        {events.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Registered</th>
                  <th>Checked in</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.category}</td>
                    <td>{formatDate(event.date)}</td>
                    <td>{event.registrations} / {event.maxCapacity}</td>
                    <td>{event.checkedIn}</td>
                    <td>{formatMoney(event.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAnalytics