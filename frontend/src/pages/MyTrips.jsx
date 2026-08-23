import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import api from '../lib/api'

export default function MyTrips() {
  const [trips, setTrips] = useState([])

  useEffect(() => {
    api.get('/trips').then((r) => setTrips(r.data))
  }, [])

  const deleteTrip = async (id) => {
    if (!confirm('Delete this trip?')) return
    await api.delete(`/trips/${id}`)
    setTrips(trips.filter((t) => t.id !== id))
  }

  return (
    <div className="min-h-screen relative bg-slate-50 text-slate-800 font-sans antialiased selection:bg-sky-200 selection:text-sky-900">

      {/* Light Background Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
                <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
          backgroundImage: `url('/d1.jpg')`,
}}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/60 via-slate-50/70 to-slate-50/90" />
      </div>

      <div className="relative z-10">
        <NavBar />

        <main className="max-w-6xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-sky-100 text-sky-700 border border-sky-200 mb-2">
                Your Journeys
              </span>
              <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">My Trips</h1>
            </div>

            <Link
              to="/trips/new"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 px-5 py-2.5 rounded-full shadow-md shadow-sky-500/20 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] w-fit"
            >
              <span className="text-lg">+</span> Plan a Trip
            </Link>
          </div>

          {/* Trips List */}
          <div className="space-y-4">
            {trips.map((t) => (
              <div
                key={t.id}
                className="group bg-white/90 hover:bg-sky-50/30 border border-slate-200/90 hover:border-sky-300 rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <Link to={`/trips/${t.id}`} className="flex-1">
                  <p className="font-display text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {t.name}
                  </p>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 mt-2 font-medium">
                    <span className="flex items-center gap-1.5 bg-sky-50 text-sky-700 px-2.5 py-1 rounded-md border border-sky-100">
                      📅 {t.start_date} → {t.end_date}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      📍 {t.stop_count} stop{t.stop_count === 1 ? '' : 's'}
                    </span>
                  </div>
                </Link>

                <div className="flex items-center gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {t.budget && (
                    <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-sm">
                      ₹{Number(t.budget).toLocaleString()}
                    </span>
                  )}
                  <Link
                    to={`/trips/${t.id}`}
                    className="text-sm font-semibold text-sky-600 hover:text-sky-700 hover:bg-sky-50 px-3.5 py-1.5 rounded-lg transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => deleteTrip(t.id)}
                    className="text-sm font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {trips.length === 0 && (
              <div className="border border-dashed border-sky-200 bg-white/80 rounded-3xl p-12 text-center text-slate-500 shadow-sm">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 text-xl">
                  🎒
                </div>
                <p className="font-semibold text-slate-800 text-lg">No trips yet.</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  You haven't planned any trips so far. Click the button above to get started!
                </p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}