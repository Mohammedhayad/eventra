import useAuth from '../hooks/useAuth'
import Home from './Home'
import Welcome from './Welcome'

function HomeRoute() {
  const { user } = useAuth()
  return user ? <Home /> : <Welcome />
}

export default HomeRoute