import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await signup(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not sign up')
    }
  }

  return (
    <div className="min-h-screen relative bg-slate-50 text-slate-800 font-sans antialiased selection:bg-sky-200 selection:text-sky-900 flex items-center justify-center px-6 py-12">

      {/* Light Scenic Background Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/90 via-slate-50/95 to-slate-50" />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-sky-500 text-white font-display font-extrabold text-xl flex items-center justify-center shadow-lg shadow-sky-500/30">
            GT
          </div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
            Start your journal
          </h1>
          <p className="text-slate-600 mt-2 text-sm">
            Create an account to plan your first trip.
          </p>
        </div>

        {/* Signup Form Card */}
        <form
          onSubmit={submit}
          className="bg-white/90 backdrop-blur-md border border-sky-100 rounded-3xl p-8 space-y-4 shadow-xl shadow-sky-100/50"
        >
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white focus:border-transparent transition-all"
              placeholder="Ada Lovelace"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white focus:border-transparent transition-all"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-full py-3 shadow-md shadow-sky-500/20 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] mt-2"
          >
            Create account
          </button>
        </form>

        {/* Footer Navigation */}
        <p className="text-center mt-6 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-600 font-semibold hover:text-sky-700 hover:underline transition-colors">
            Log in
          </Link>
        </p>

      </div>
    </div>
  )
}