import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer'
import useAuth from '../hooks/useAuth'

function MainLayout() {
  const { pathname } = useLocation()
  const { user } = useAuth()

  const isFullScreenPage =
    pathname === '/login' ||
    pathname === '/register' ||
    (pathname === '/' && !user)

  if (isFullScreenPage) {
    return <Outlet />
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="container main-content">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}

export default MainLayout