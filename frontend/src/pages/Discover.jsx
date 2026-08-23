import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import api from '../lib/api'

export default function Discover() {
  const [query, setQuery] = useState('')
  const [cities, setCities] = useState([])
  const [selected, setSelected] = useState(null)
  const [activities, setActivities] = useState([])

  const search = () => api.get('/cities', { params: { q: query || undefined } }).then((r) => setCities(r.data))

  useEffect(() => { search() }, [])

  const openCity = async (city) => {
    setSelected(city)
    const { data } = await api.get(`/cities/${city.id}/activities`)
    setActivities(data)
  }

  return (
    <div className="min-h-screen relative bg-slate-50 text-slate-800 font-sans antialiased selection:bg-sky-200 selection:text-sky-900">

      {/* Light Scenic Background Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: `url('https://picsum.photos/seed/globetrotter/2000/1200')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/90 via-slate-50/95 to-slate-50" />
      </div>

      <div className="relative z-10">
        <NavBar />

        <main className="max-w-6xl mx-auto px-6 py-10">

          {/* Section Header */}
          <div className="mb-8">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-sky-100 text-sky-700 border border-sky-200 mb-3">
              Explore Destinations
            </span>
            <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">Discover</h1>
            <p className="text-slate-600 mt-1 text-base">Search cities and see what there is to do.</p>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3 mb-8 max-w-2xl">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              placeholder="Search cities…"
              className="flex-1 border border-slate-200 rounded-full px-5 py-3 bg-white/90 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm transition-all"
            />
            <button
              onClick={search}
              className="bg-sky-500 hover:bg-sky-600 text-white px-7 py-3 rounded-full font-semibold shadow-md shadow-sky-500/20 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              Search
            </button>
          </div>

          {/* Content Layout */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* Cities Grid */}
            <div className="grid sm:grid-cols-2 gap-4 content-start">
              {cities.map((c) => (
                <button
                  key={c.id}
                  onClick={() => openCity(c)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
                    selected?.id === c.id
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sky-500/20 scale-[1.01]'
                      : 'bg-white/90 hover:bg-sky-50/50 border-slate-200 hover:border-sky-300 text-slate-800'
                  }`}
                >
                  <p className="font-display text-lg font-bold">{c.name}</p>
                  <p className={`text-sm ${selected?.id === c.id ? 'text-sky-100' : 'text-slate-500'}`}>{c.country}</p>
                  <p className={`text-xs mt-3 ${selected?.id === c.id ? 'text-sky-100' : 'text-slate-400'}`}>
                    Cost index: {c.cost_index ?? '—'} · Popularity: {c.popularity ?? 0}
                  </p>
                </button>
              ))}
              {cities.length === 0 && (
                <div className="col-span-2 bg-white/80 border border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-sm">
                  No cities found.
                </div>
              )}
            </div>

            {/* Activities Details Panel */}
            <div>
              {selected ? (
                <div className="bg-white/90 backdrop-blur-md border border-sky-100 rounded-3xl p-6 shadow-xl shadow-sky-100/50">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <h2 className="font-display text-xl font-bold text-slate-900">
                      Activities in <span className="text-sky-600">{selected.name}</span>
                    </h2>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full">
                      {activities.length} Available
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activities.map((a) => (
                      <div key={a.id} className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 hover:border-sky-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-800">{a.name}</p>
                          <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-sm">
                            ₹{Number(a.cost).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 capitalize font-medium">
                          📍 {a.type} {a.duration ? `· ⏱️ ${a.duration}h` : ''}
                        </p>
                      </div>
                    ))}
                    {activities.length === 0 && (
                      <p className="text-slate-500 text-sm italic py-4 text-center">No activities listed for this city yet.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-sky-200 bg-white/80 rounded-3xl p-12 text-center text-slate-500 shadow-sm">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 text-xl">
                    🗺️
                  </div>
                  <p className="font-medium text-slate-700">Select a city to explore</p>
                  <p className="text-xs text-slate-400 mt-1">Click any city card on the left to see available activities and pricing.</p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}