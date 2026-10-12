import { CalendarDays } from 'lucide-react'
import './Logo.css'

function Logo({ size = 'md', stacked = false }) {
  const classes = ['logo', `logo-${size}`, stacked ? 'logo-stacked' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes}>
      <span className="logo-mark">
        <CalendarDays />
      </span>
      <span className="logo-text">Eventra</span>
    </span>
  )
}

export default Logo