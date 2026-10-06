import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import MyRegistrations from './pages/MyRegistrations'
import QRPass from './pages/QRPass'
import AdminDashboard from './pages/AdminDashboard'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminRegistrations from './pages/AdminRegistrations'
import AdminUsers from './pages/AdminUsers'
import EventForm from './pages/EventForm'
import CheckIn from './pages/CheckIn'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
          <Route path="/registrations/:id" element={<QRPass />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/registrations" element={<AdminRegistrations />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/checkin" element={<CheckIn />} />
            <Route path="/admin/events/new" element={<EventForm />} />
            <Route path="/admin/events/:id/edit" element={<EventForm />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App