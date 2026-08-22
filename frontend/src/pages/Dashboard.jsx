import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [cities, setCities] = useState([])

  useEffect(() => {
    api.get('/trips').then((r) => setTrips(r.data)).catch(() => {})
    api.get('/cities').then((r) => setCities(r.data.slice(0, 4))).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen relative bg-slate-50 text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-sky-200 selection:text-sky-900 flex flex-col justify-between">

      {/* Full-screen Background Image Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/hero-map.jpg"
          alt="Dashboard Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10">
        <NavBar />

        <main className="max-w-6xl mx-auto px-6 py-10">

          {/* Top Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-white/90 border border-sky-100 p-8 sm:p-10 mb-10 shadow-xl shadow-sky-100/50 backdrop-blur-md group">
            <div
              className="absolute inset-0 bg-cover bg-right opacity-10 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              style={{
                backgroundImage: `url('/hero-map.jpg')`,
              }}
            />

            <div className="relative z-10">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-sky-100 text-sky-700 border border-sky-200 mb-4">
                Explore the World
              </span>
              <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
                Welcome back, <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span> ✨
              </h1>
              <p className="text-slate-600 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                Here's where your journeys stand. Ready to plan your next destination?
              </p>
            </div>
          </div>

          {/* Upcoming Trips Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">Upcoming trips</h2>
              <div className="h-1 w-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full mt-1" />
            </div>

            <Link
              to="/trips/new"
              className="group relative inline-flex items-center gap-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 px-5 py-2.5 rounded-full shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-200 hover:scale-[1.02]"
            >
              <span className="text-lg group-hover:rotate-90 transition-transform duration-300">+</span> Plan new trip
            </Link>
          </div>

          {/* Trips Grid / Empty State */}
          {trips.length === 0 ? (
            <div className="ticket-card relative overflow-hidden border border-dashed border-sky-200 bg-white/90 backdrop-blur-md rounded-3xl p-12 text-center text-slate-600 mb-14 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 text-2xl shadow-inner">
                ✈️
              </div>
              <p className="text-lg font-semibold text-slate-800">No trips planned yet</p>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">Every great journey starts with a single step. Begin organizing your next itinerary now.</p>

              <div className="mt-6">
                <Link
                  to="/trips/new"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-7 py-3 rounded-full font-medium shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  Plan your first trip
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
              {trips.map((t) => (
                <Link
                  key={t.id}
                  to={`/trips/${t.id}`}
                  className="ticket-card group relative bg-white/90 hover:bg-sky-50/80 border border-slate-200/80 hover:border-sky-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 block hover:-translate-y-1 backdrop-blur-sm"
                >
                  <p className="font-display text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{t.name}</p>

                  <div className="flex items-center gap-2 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-lg mt-3 w-fit">
                    <span>📅</span>
                    <span>{t.start_date} → {t.end_date}</span>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 text-sm">
                    <span className="text-route font-medium text-sky-700 bg-sky-100/60 px-3 py-1 rounded-md border border-sky-200/50">
                      📍 {t.stop_count} stop{t.stop_count === 1 ? '' : 's'}
                    </span>
                    {t.budget && (
                      <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                        ₹{Number(t.budget).toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Popular Destinations */}
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-wide">Popular destinations</h2>
            <div className="h-1 w-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full mt-1" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {cities.map((c, index) => {
              const cityImages = [
                'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop'
              ]
              const bgUrl = cityImages[index % cityImages.length]

              return (
                <div
                  key={c.id}
                  className="group relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-slate-200"
                >
                 <div
  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
  style={{
    backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop')`
  }}
/>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-display text-lg font-bold text-white group-hover:text-sky-300 transition-colors">{c.name}</p>
                    <p className="text-xs text-sky-200 font-semibold uppercase tracking-wider">{c.country}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* About & Platform Description Section */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-sky-100 shadow-sm mb-12">
            <div className="max-w-3xl">
              <span className="text-xs font-semibold text-sky-600 bg-sky-50 border border-sky-100 px-3 py-1 rounded-full uppercase tracking-wider">
                About GlobeTrotter
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-3 mb-2">Smart Itinerary Planning Made Simple</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                GlobeTrotter helps you organize itineraries, estimate travel costs, and keep track of your multi-destination stops seamlessly. Build custom vacation routes or explore globally trending cities for your next getaway.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <span>Automated Route Optimization</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <span>Budget & Expense Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <span>Real-time Destination Discovery</span>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* Contact & Site Footer */}
      <footer className="relative z-10 bg-white/95 backdrop-blur-md border-t border-sky-100 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-slate-600 text-sm">

            {/* Brand Col */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                  GT
                </div>
                <span className="font-display text-lg font-bold text-slate-900">GlobeTrotter</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your modern companion for stress-free trip planning and seamless travel itineraries.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Quick Navigation</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/dashboard" className="hover:text-sky-600 transition-colors">Dashboard</Link></li>
                <li><Link to="/trips/new" className="hover:text-sky-600 transition-colors">Plan New Trip</Link></li>
                <li><Link to="/cities" className="hover:text-sky-600 transition-colors">Explore Cities</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Contact Us</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <span>✉️</span>
                  <span>support@globetrotter.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+1 (800) 555-4321</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Global Travel Hub, Suite 400</span>
                </li>
              </ul>
            </div>

            {/* Support info */}
            <div>
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Help & Support</h4>
              <p className="text-xs text-slate-500 mb-2">Have questions about your itinerary or budget tracking?</p>
              <a
                href="mailto:support@globetrotter.com"
                className="inline-block text-xs font-semibold text-sky-600 hover:text-sky-700 underline"
              >
                Send Support Inquiry
              </a>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
            <p>© {new Date().getFullYear()} GlobeTrotter Inc. All rights reserved.</p>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}