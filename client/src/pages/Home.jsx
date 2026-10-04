import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import EventCard from '../components/EventCard'

function Home() {
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
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= today)
    .slice(0, 3)

  return (
    <div>
      <section className="hero">
        <h1>All your campus events, in one place</h1>
        <p>
          Discover workshops, fests and talks. Register in seconds and get a
          QR pass for easy check-in.
        </p>
        <Link to="/events" className="btn">Browse Events</Link>
      </section>

      <section>
        <h2 className="section-title">Upcoming Events</h2>

        {loading && <p>Loading events...</p>}
        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
        {!loading && !error && upcomingEvents.length === 0 && (
          <p>No upcoming events yet. Check back soon!</p>
        )}

        <div className="events-grid">
          {upcomingEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>

        {upcomingEvents.length > 0 && (
          <div className="view-all">
            <Link to="/events">View all events →</Link>
          </div>
        )}
      </section>

      <section className="features">
        <div className="card">
          <h3>Discover</h3>
          <p>Find academic, technical and cultural events across campus.</p>
        </div>
        <div className="card">
          <h3>Register</h3>
          <p>Sign up online and pay securely for paid events.</p>
        </div>
        <div className="card">
          <h3>Check in</h3>
          <p>Show your QR pass at the venue and you are in.</p>
        </div>
      </section>
    </div>
  )
}

export default Home