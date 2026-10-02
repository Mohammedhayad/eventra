import { Link } from 'react-router-dom'

function Home() {
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