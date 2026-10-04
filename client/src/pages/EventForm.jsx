import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import './Auth.css'
import './Admin.css'

function EventForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    venue: '',
    maxCapacity: '',
    registrationFee: '0',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesResponse = await api.get('/events/categories')
        setCategories(categoriesResponse.data.categories)

        if (isEditing) {
          const eventResponse = await api.get(`/events/${id}`)
          const event = eventResponse.data.event

          setFormData({
            title: event.title,
            description: event.description,
            category: event.category,
            date: event.date.slice(0, 10),
            time: event.time,
            venue: event.venue,
            maxCapacity: String(event.maxCapacity),
            registrationFee: String(event.registrationFee),
          })
        }
      } catch {
        setError('Could not load the form data. Please go back and try again.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, isEditing])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const { title, description, category, date, time, venue, maxCapacity } = formData

    if (!title.trim() || !description.trim() || !category || !date || !time.trim() || !venue.trim()) {
      setError('Please fill in all the fields')
      return
    }

    if (Number(maxCapacity) < 1) {
      setError('Maximum capacity must be at least 1')
      return
    }

    if (Number(formData.registrationFee) < 0) {
      setError('Registration fee cannot be negative')
      return
    }

    const payload = {
      ...formData,
      maxCapacity: Number(formData.maxCapacity),
      registrationFee: Number(formData.registrationFee || 0),
    }

    try {
      setSaving(true)

      if (isEditing) {
        await api.put(`/events/${id}`, payload)
      } else {
        await api.post('/events', payload)
      }

      navigate('/admin')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not reach the server. Is it running?'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card admin-form-card">
        <h2>{isEditing ? 'Edit Event' : 'Create Event'}</h2>
        <p className="auth-subtitle">
          {isEditing
            ? 'Update the event details below.'
            : 'Fill in the details to post a new event.'}
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">Event title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. HackSprint 2026"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell students what this event is about"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                id="time"
                name="time"
                type="text"
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g. 9:00 AM"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="venue">Venue</label>
            <input
              id="venue"
              name="venue"
              type="text"
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g. Main Auditorium"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="maxCapacity">Maximum capacity</label>
              <input
                id="maxCapacity"
                name="maxCapacity"
                type="number"
                min="1"
                value={formData.maxCapacity}
                onChange={handleChange}
                placeholder="e.g. 100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="registrationFee">Registration fee (₹)</label>
              <input
                id="registrationFee"
                name="registrationFee"
                type="number"
                min="0"
                value={formData.registrationFee}
                onChange={handleChange}
              />
              <span className="form-hint">Enter 0 for a free event.</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="auth-btn" disabled={saving}>
              {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Create event'}
            </button>
            <Link to="/admin">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventForm