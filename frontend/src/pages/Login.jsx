import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not log in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative bg-slate-50 text-slate-800 font-sans antialiased flex items-center justify-center p-6 overflow-hidden">

      {/* Light Scenic Background Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 scale-105"
          style={{
            backgroundImage: `url('hero-map.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/60 via-slate-50/90 to-slate-50" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">

        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg shadow-sky-500/30 border border-sky-300/40">
            GT
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Sign in to continue planning your next adventure.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-xl border border-sky-100/80 rounded-3xl p-8 shadow-xl shadow-sky-100/50">

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-4 focus:ring-sky-500/10"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 focus:border-sky-400 focus:bg-white rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-4 focus:ring-sky-500/10"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-2xl py-3 text-sm shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 transition-all duration-200 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              New to GlobeTrotter?{' '}
              <Link to="/signup" className="text-sky-600 font-semibold hover:text-sky-700 hover:underline">
                Create an account
              </Link>
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}