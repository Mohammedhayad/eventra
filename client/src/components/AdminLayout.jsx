import { NavLink, Outlet } from 'react-router-dom'
import './AdminLayout.css'

function AdminLayout() {
  return (
    <div>
      <nav className="admin-tabs">
        <NavLink to="/admin" end>Events</NavLink>
        <NavLink to="/admin/analytics">Analytics</NavLink>
        <NavLink to="/admin/registrations">Registrations</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/checkin">Check-in</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}

export default AdminLayout