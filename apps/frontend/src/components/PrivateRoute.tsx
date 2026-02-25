import { Navigate } from 'react-router-dom'
import { authService } from '../services/authService.ts'
import type { ReactNode } from 'react'

export default function PrivateRoute({ children }: { children: ReactNode }) {
  return authService.isAuth() ? children : <Navigate to="/login" />
}
