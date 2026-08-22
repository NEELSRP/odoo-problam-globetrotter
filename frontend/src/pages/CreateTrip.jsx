import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import api from '../lib/api'

export default function CreateTrip() {
  const [form, setForm] = useState({ name: '', start_date: '', end_date: '', description: '', budget: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = { ...form, budget: form.budget ? Number(form.budget) : null }
      const { data } = await api.post('/trips', payload)
      navigate(`/trips/${data.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not create trip')
    }
  }

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
        <NavBar />
        <main className="max-w-xl mx-auto px-6 py-12">

          {/* Header */}
          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-sky-100 text-sky-700 border border-sky-200 mb-3">
              New Itinerary
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Plan a new trip
            </h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Give it a name and dates — you'll add cities and activities next.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={submit}
            className="bg-white/90 backdrop-blur-md border border-sky-100 rounded-3xl p-8 space-y-5 shadow-xl shadow-sky-100/50"
          >
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Trip name
              </label>
              <input
                required
                value={form.name}
                onChange={update('name')}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white focus:border-transparent transition-all"
                placeholder="Summer in Southeast Asia"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Start date
                </label>
                <input
                  type="date"
                  required
                  value={form.start_date}
                  onChange={update('start_date')}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  End date
                </label>
                <input
                  type="date"
                  required
                  value={form.end_date}
                  onChange={update('end_date')}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Budget (₹)
              </label>
              <input
                type="number"
                min="0"
                value={form.budget}
                onChange={update('budget')}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white focus:border-transparent transition-all font-mono"
                placeholder="20000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={update('description')}
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white focus:border-transparent transition-all resize-none"
                placeholder="What's this trip about?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-full py-3 shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-200 hover:scale-[1.01] mt-2"
            >
              Create trip
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}