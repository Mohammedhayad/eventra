import useAuth from '../hooks/useAuth'

function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p style={{ marginBottom: '20px' }}>Welcome, {user.name}!</p>

      <div className="features">
        <div className="card">
          <h3>Manage events</h3>
          <p>Posting and editing events will be added in the next phase.</p>
        </div>
        <div className="card">
          <h3>Registrations</h3>
          <p>Registration details will appear here later.</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard