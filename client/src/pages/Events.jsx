import EventCard from '../components/EventCard'
import sampleEvents from '../Data/sampleEvents'

function Events() {
  return (
    <div>
      <h2>All Events</h2>
      <p style={{ marginBottom: '20px' }}>
        {sampleEvents.length} events coming up on campus.
      </p>
      <div className="events-grid">
        {sampleEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

export default Events