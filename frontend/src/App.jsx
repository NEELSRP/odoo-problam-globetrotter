import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import MyTrips from './pages/MyTrips'
import CreateTrip from './pages/CreateTrip'
import TripDetail from './pages/TripDetail'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import SharedTrip from './pages/SharedTrip'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/shared/:id" element={<SharedTrip />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
      <Route path="/trips/new" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
      <Route path="/trips/:id" element={<ProtectedRoute><TripDetail /></ProtectedRoute>} />
      <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  )
}
