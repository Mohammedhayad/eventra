import { Link, NavLink } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Logo from './Logo'
import './Navbar.css'

function Navbar() {
  const { user } = useAuth()
  const initial = user ? user.name.trim().charAt(0).toUpperCase() : ''

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" aria-label="Eventra home">
          <Logo />
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/events">Events</NavLink>
          {user?.role === 'student' && (
            <NavLink to="/my-registrations">My Registrations</NavLink>
          )}
          {user?.role === 'admin' && (
            <>
              <NavLink to="/admin">Admin</NavLink>
              <NavLink to="/admin/checkin">Check-in</NavLink>
            </>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <Link to="/profile" className="nav-avatar" title={user.name}>
              {initial}
            </Link>
          ) : (
            <>
              <Link to="/login" className="nav-login">Login</Link>
              <Link to="/register" className="nav-signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar