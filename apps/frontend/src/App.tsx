import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/AdminLayout.tsx'
import PrivateRoute from './components/PrivateRoute.tsx'
import Login from './pages/login/LoginPage.tsx'
import Dashboard from './pages/dashboard/Dashboard.tsx'
import OfferPage from './pages/offer/OfferPage.tsx'
import { GlobalSnackbar } from './components/GlobalSnackbar.tsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import AffiliateNetworkPage from './pages/affiliate-network/AffiliateNetworkPage.tsx'
import { useSystemCheck } from './hooks/useSystemCheck.ts'
import SetupPage from './pages/setup/SetupPage.tsx'
import { LinearProgress } from '@mui/material'

const queryClient = new QueryClient()

/** Inner content that depends on system initialization status. */
function AppContent() {
  const { status, markInitialized } = useSystemCheck()

  if (status === 'loading') return <LinearProgress />

  if (status === 'setup') return <SetupPage onComplete={markInitialized} />

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
        <Route path="affiliate-network" element={<AffiliateNetworkPage />} />
        <Route path="offers" element={<OfferPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <GlobalSnackbar />
      </QueryClientProvider>
    </>
  )
}
