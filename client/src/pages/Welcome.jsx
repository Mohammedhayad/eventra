import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import './Welcome.css'

function Welcome() {
  return (
    <div className="welcome">
      <div>
        <Logo size="lg" stacked />
        <p className="welcome-tagline">
          Discover · Register · Be Part of Campus Events
        </p>
      </div>

      <div className="welcome-actions">
        <Link to="/register" className="welcome-btn welcome-btn-primary">
          Get Started
        </Link>
        <Link to="/login" className="welcome-btn welcome-btn-outline">
          Login
        </Link>
        <Link to="/events" className="welcome-guest">
          Continue as guest
        </Link>
      </div>
    </div>
  )
}

export default Welcome