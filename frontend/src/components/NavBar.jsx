import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="border-b-2 border-ink/10 bg-paper/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="stamp-badge text-stamp w-9 h-9 text-xs font-display font-bold">GT</span>
          <span className="font-display text-xl font-semibold tracking-tight">GlobeTrotter</span>
        </Link>

        {user && (
          <nav className="flex items-center gap-6 font-body text-sm">
            <Link to="/dashboard" className="hover:text-stamp transition-colors">Dashboard</Link>
            <Link to="/trips" className="hover:text-stamp transition-colors">My Trips</Link>
            <Link to="/discover" className="hover:text-stamp transition-colors">Discover</Link>
            <Link to="/profile" className="hover:text-stamp transition-colors">Profile</Link>
            <Link to="/trips/new" className="px-4 py-2 bg-stamp text-paper rounded-full hover:bg-stamp-dark transition-colors font-medium">
              Plan a Trip
            </Link>
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="text-ink-soft hover:text-stamp transition-colors"
            >
              Log out
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
