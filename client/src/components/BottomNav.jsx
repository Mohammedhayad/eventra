import { NavLink, useLocation } from 'react-router-dom'
import {
  House,
  CalendarDays,
  Ticket,
  User,
  LayoutDashboard,
  ScanLine,
  LogIn,
} from 'lucide-react'
import useAuth from '../hooks/useAuth'
import './BottomNav.css'

const home = { to: '/', label: 'Home', icon: House, end: true }
const events = { to: '/events', label: 'Events', icon: CalendarDays }

function BottomNav() {
  const { user } = useAuth()
  const { pathname } = useLocation()

  let items

  if (!user) {
    items = [home, events, { to: '/login', label: 'Login', icon: LogIn }]
  } else if (user.role === 'admin') {
    items = [
      home,
      events,
      { to: '/admin', label: 'Admin', icon: LayoutDashboard, end: true },
      { to: '/admin/checkin', label: 'Check-in', icon: ScanLine },
    ]
  } else {
    items = [
      home,
      events,
      { to: '/my-registrations', label: 'Registrations', icon: Ticket },
      { to: '/profile', label: 'Profile', icon: User },
    ]
  }

  return (
    <nav className="bottom-nav">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            isActive || (to === '/' && pathname === '/dashboard') ? 'active' : ''
          }
        >
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav