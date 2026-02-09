import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layout/AdminLayout.tsx'
import PrivateRoute from './auth/PrivateRoute.tsx'
import Login from './auth/Login.tsx'
import Dashboard from './pages/Dashboard.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="" element={<Dashboard />} />
        <Route path="offers" element={<h1>offers</h1>} />
      </Route>
    </Routes>
  )
}
