import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">Eventra</Link>
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register" className="btn-link">Sign Up</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar