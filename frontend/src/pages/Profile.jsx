import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' })
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const save = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('')
    try {
      const payload = { name: form.name, email: form.email }
      if (form.password) payload.password = form.password
      const { data } = await api.put('/users/me', payload)
      localStorage.setItem('gt_user', JSON.stringify(data))
      setStatus('Saved successfully.')
      setForm({ ...form, password: '' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not save changes')
    }
  }

  const deleteAccount = async () => {
    if (!confirm('This deletes your account and all trips permanently. Continue?')) return
    await api.delete('/users/me')
    logout()
    navigate('/signup')
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
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-sky-100 text-sky-700 border border-sky-200 mb-3">
              Account Settings
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Profile & Settings
            </h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              Update your details or manage your account preferences.
            </p>
          </div>

          {/* Profile Form Card */}
          <form
            onSubmit={save}
            className="bg-white/90 backdrop-blur-md border border-sky-100 rounded-3xl p-8 space-y-5 shadow-xl shadow-sky-100/50 mb-8"
          >
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            {status && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
                {status}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                New password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Leave blank to keep current password"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-full py-3 shadow-md shadow-sky-500/20 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] mt-2"
            >
              Save changes
            </button>
          </form>

          {/* Danger Zone Card */}
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
            <h2 className="font-display text-lg font-bold text-rose-700 mb-1 flex items-center gap-2">
              ⚠️ Delete account
            </h2>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              This permanently removes your account and every trip you've planned. This action cannot be undone.
            </p>
            <button
              type="button"
              onClick={deleteAccount}
              className="border border-rose-300 text-rose-600 hover:bg-rose-600 hover:text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-md"
            >
              Delete my account
            </button>
          </div>

        </main>
      </div>
    </div>
  )
}