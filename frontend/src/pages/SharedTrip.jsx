import { useEffect, useState } from 'react'
import { useParams } from 'react'
import api from '../lib/api'

export default function SharedTrip() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/shared/trips/${id}`).then((r) => setTrip(r.data)).catch(() => setError('Trip not found or not shared.'))
  }, [id])

  if (error) {
    return (
      <div className="min-h-screen relative bg-slate-50 flex items-center justify-center p-6 text-slate-500 antialiased">
        <div className="bg-white border border-rose-100 shadow-xl shadow-rose-100/50 rounded-3xl p-8 max-w-sm text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 text-xl">
            ⚠️
          </div>
          <p className="font-semibold text-slate-800 text-base">{error}</p>
        </div>
      </div>
    )
  }

  if (!trip) return <div className="min-h-screen bg-slate-50" />

  return (
    <div className="min-h-screen relative bg-slate-50 text-slate-800 font-sans antialiased selection:bg-sky-200 selection:text-sky-900">

      {/* Light Background Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/90 via-slate-50/95 to-slate-50" />
      </div>

      <div className="relative z-10">

        {/* Minimal Header for Shared View */}
        <header className="max-w-4xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-dashed border-sky-400 bg-sky-50 flex items-center justify-center shadow-sm">
              <span className="font-display font-extrabold text-sky-600 text-xs tracking-wider">
                GT
              </span>
            </div>
            <span className="font-display text-xl font-extrabold text-slate-900 tracking-tight">
              GlobeTrotter
            </span>
          </div>

          <span className="text-xs uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 font-semibold rounded-full px-3 py-1 shadow-sm">
            Shared View
          </span>
        </header>

        <main className="max-w-4xl mx-auto px-6 pb-16">

          {/* Main Trip Overview Card */}
          <div className="bg-white/90 backdrop-blur-md border border-sky-100 rounded-3xl p-8 mb-8 shadow-xl shadow-sky-100/50">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {trip.name}
            </h1>

            <div className="flex items-center gap-2 mt-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 border border-sky-100 font-medium text-xs sm:text-sm px-3 py-1 rounded-md">
                📅 {trip.start_date} → {trip.end_date}
              </span>
            </div>

            {trip.description && (
              <p className="text-slate-600 text-base max-w-2xl leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                {trip.description}
              </p>
            )}
          </div>

          {/* Stops Visual Sequence */}
          <div className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Route Overview</h2>
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
              {trip.stops.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 shrink-0">
                  <div className="bg-white border border-sky-200 rounded-2xl p-3 text-center shadow-sm min-w-[90px]">
                    <div className="w-8 h-8 rounded-xl bg-sky-500 text-white font-bold text-xs flex items-center justify-center mx-auto mb-1 shadow-sm">
                      {s.city.name.slice(0, 3).toUpperCase()}
                    </div>
                    <p className="text-xs font-semibold text-slate-800 truncate">{s.city.name}</p>
                  </div>

                  {i < trip.stops.length - 1 && (
                    <div className="h-0.5 w-6 bg-sky-200 rounded-full shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Stops List */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Itinerary Details</h2>
            {trip.stops.map((s) => (
              <div
                key={s.id}
                className="bg-white/90 border border-slate-200/80 hover:border-sky-300 rounded-2xl p-5 shadow-sm transition-all flex items-center justify-between"
              >
                <div>
                  <p className="font-display font-bold text-slate-900 text-lg">
                    📍 {s.city.name}, <span className="text-slate-500 font-normal text-base">{s.city.country}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-sky-700 font-medium mt-1">
                    {s.start_date} → {s.end_date}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}