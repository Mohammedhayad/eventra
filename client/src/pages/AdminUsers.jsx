import { useState, useEffect } from 'react'
import api from '../services/api'
import './Admin.css'

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users')
        setUsers(response.data.users)
      } catch {
        setError('Could not load users. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div>
      <div className="admin-header">
        <div>
          <h2>Users</h2>
          <p className="admin-subtitle">{users.length} account(s)</p>
        </div>
      </div>

      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      {loading && <p>Loading users...</p>}

      {!loading && users.length > 0 && (
        <div className="table-wrapper">
          <table className="events-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>College ID</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.collegeId || '-'}</td>
                  <td>{user.role}</td>
                  <td>{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminUsers