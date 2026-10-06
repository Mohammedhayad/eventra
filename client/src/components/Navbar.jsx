import { Link, NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">Eventra</Link>
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/events">Events</NavLink>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <NavLink to="/admin" end>Admin Dashboard</NavLink>
                  <NavLink to="/admin/checkin">Check-in</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/my-registrations">My Registrations</NavLink>
                  <NavLink to="/dashboard">My Dashboard</NavLink>
                </>
              )}
              <span className="nav-user">Hi, {user.name}</span>
              <button className="nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="btn-link">Sign Up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar