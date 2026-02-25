import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/AdminLayout.tsx'
import PrivateRoute from './components/PrivateRoute.tsx'
import Login from './pages/login/LoginPage.tsx'
import Dashboard from './pages/dashboard/Dashboard.tsx'
import OfferPage from './pages/offer/OfferPage.tsx'
import { GlobalSnackbar } from './components/GlobalSnackbar.tsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import AffiliateNetworkPage from './pages/affiliate-network/AffiliateNetworkPage.tsx'

const queryClient = new QueryClient()

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
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
            <Route
              path="affiliate-network"
              element={<AffiliateNetworkPage />}
            />
            <Route path="offers" element={<OfferPage />} />
          </Route>
        </Routes>
        <GlobalSnackbar />
      </QueryClientProvider>
    </>
  )
}
