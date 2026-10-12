import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  GraduationCap,
  Ticket,
  LayoutDashboard,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import useAuth from '../hooks/useAuth'
import './Profile.css'

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initial = user.name.trim().charAt(0).toUpperCase()
  const isAdmin = user.role === 'admin'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">{initial}</div>
        <h2>{user.name}</h2>
        <span className="role-pill">{isAdmin ? 'Admin' : 'Student'}</span>
      </div>

      <div className="profile-list">
        <div className="profile-row">
          <Mail size={20} />
          <div className="row-body">
            <small>Email</small>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="profile-row">
          <GraduationCap size={20} />
          <div className="row-body">
            <small>College ID</small>
            <p>{user.collegeId || 'Not added'}</p>
          </div>
        </div>
      </div>

      <div className="profile-list">
        {isAdmin ? (
          <Link to="/admin" className="profile-row">
            <LayoutDashboard size={20} />
            <div className="row-body">
              <p>Admin dashboard</p>
            </div>
            <ChevronRight size={18} className="chevron" />
          </Link>
        ) : (
          <>
            <Link to="/dashboard" className="profile-row">
              <LayoutDashboard size={20} />
              <div className="row-body">
                <p>My dashboard</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </Link>
            <Link to="/my-registrations" className="profile-row">
              <Ticket size={20} />
              <div className="row-body">
                <p>My registrations</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </Link>
          </>
        )}
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </div>
  )
}

export default Profile