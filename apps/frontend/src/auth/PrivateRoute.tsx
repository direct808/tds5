import { Navigate } from 'react-router-dom'
import { auth } from './auth'
import type { ReactNode } from 'react'

export default function PrivateRoute({ children }: { children: ReactNode }) {
  return auth.isAuth() ? children : <Navigate to="/login" />
}
