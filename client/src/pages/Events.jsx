import { useState, useEffect } from 'react'
import api from '../services/api'
import EventCard from '../components/EventCard'

function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events')
        setEvents(response.data.events)
      } catch {
        setError('Could not load events. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingEvents = events.filter((event) => new Date(event.date) >= today)

  return (
    <div>
      <h2>All Events</h2>

      {loading && <p>Loading events...</p>}
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      {!loading && !error && (
        <p style={{ marginBottom: '20px' }}>
          {upcomingEvents.length === 0
            ? 'No upcoming events yet. Check back soon!'
            : `${upcomingEvents.length} upcoming event(s) on campus.`}
        </p>
      )}

      <div className="events-grid">
        {upcomingEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  )
}

export default Events