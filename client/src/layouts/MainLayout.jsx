import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function MainLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout