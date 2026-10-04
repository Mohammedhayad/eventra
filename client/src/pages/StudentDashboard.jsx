import useAuth from '../hooks/useAuth'

function StudentDashboard() {
  const { user } = useAuth()

  return (
    <div>
      <h2>Student Dashboard</h2>
      <p style={{ marginBottom: '20px' }}>Welcome, {user.name}!</p>

      <div className="features">
        <div className="card">
          <h3>Your details</h3>
          <p>Email: {user.email}</p>
          <p>College ID: {user.collegeId || 'Not added'}</p>
        </div>
        <div className="card">
          <h3>My registrations</h3>
          <p>Your event registrations will appear here soon.</p>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard