import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api'
import EventCard from '../components/EventCard'
import './Events.css'

function Events() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filter values live in the URL, e.g. /events?q=hack&category=Hackathons
  const search = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'All'
  const price = searchParams.get('price') || 'all'
  const when = searchParams.get('when') || 'any'

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsResponse, categoriesResponse] = await Promise.all([
          api.get('/events'),
          api.get('/events/categories'),
        ])
        setEvents(eventsResponse.data.events)
        setCategories(categoriesResponse.data.categories)
      } catch {
        setError('Could not load events. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const updateParam = (key, value, defaultValue) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === defaultValue) {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setSearchParams(next, { replace: true })
  }

  const clearFilters = () => setSearchParams({}, { replace: true })

  const hasFilters =
    search || category !== 'All' || price !== 'all' || when !== 'any'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const daysFromToday = (days) => {
    const date = new Date(today)
    date.setDate(date.getDate() + days)
    return date
  }

  const term = search.trim().toLowerCase()

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date)

    if (eventDate < today) return false

    if (term) {
      const text =
        `${event.title} ${event.description} ${event.venue} ${event.category}`.toLowerCase()
      if (!text.includes(term)) return false
    }

    if (category !== 'All' && event.category !== category) return false
    if (price === 'free' && event.registrationFee > 0) return false
    if (price === 'paid' && !(event.registrationFee > 0)) return false
    if (when === 'week' && eventDate > daysFromToday(7)) return false
    if (when === 'month' && eventDate > daysFromToday(30)) return false

    return true
  })

  return (
    <div>
      <h2>All Events</h2>

      <div className="events-toolbar">
        <input
          type="search"
          className="search-input"
          placeholder="Search events by title, venue or description..."
          value={search}
          onChange={(e) => updateParam('q', e.target.value, '')}
        />

        <select
          className="filter-select"
          value={price}
          onChange={(e) => updateParam('price', e.target.value, 'all')}
        >
          <option value="all">Free and paid</option>
          <option value="free">Free only</option>
          <option value="paid">Paid only</option>
        </select>

        <select
          className="filter-select"
          value={when}
          onChange={(e) => updateParam('when', e.target.value, 'any')}
        >
          <option value="any">Any date</option>
          <option value="week">Next 7 days</option>
          <option value="month">Next 30 days</option>
        </select>
      </div>

      <div className="category-chips">
        {['All', ...categories].map((name) => (
          <button
            key={name}
            className={name === category ? 'chip active' : 'chip'}
            onClick={() => updateParam('category', name, 'All')}
          >
            {name}
          </button>
        ))}
      </div>

      {loading && <p>Loading events...</p>}
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}

      {!loading && !error && (
        <div className="results-row">
          <span>
            {filteredEvents.length === 0
              ? 'No events match your search.'
              : `${filteredEvents.length} event(s) found`}
          </span>
          {hasFilters && (
            <button className="clear-btn" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="events-grid">
        {filteredEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  )
}

export default Events