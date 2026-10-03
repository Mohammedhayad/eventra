import './EventCard.css'

function EventCard({ event }) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const isFree = event.fee === 0

  return (
    <div className="event-card">
      <div className="event-banner">{event.category}</div>
      <div className="event-body">
        <h3>{event.title}</h3>
        <p className="event-meta">📅 {formattedDate} · {event.time}</p>
        <p className="event-meta">📍 {event.venue}</p>
        <p className="event-desc">{event.description}</p>
        <div className="event-footer">
          <span className={isFree ? 'badge badge-free' : 'badge badge-paid'}>
            {isFree ? 'Free' : `₹${event.fee}`}
          </span>
          <button className="card-btn">View details</button>
        </div>
      </div>
    </div>
  )
}

export default EventCard