import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { AuthPage } from './pages/AuthPage'
import { AppPage } from './pages/AppPage'
import { DashboardPage } from './pages/DashboardPage'
import { CategoryPage } from './pages/CategoryPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { useAuthStore } from './store/useAuthStore'

function AppLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <Outlet />
    </div>
  )
}

function LoginRoute() {
  const user = useAuthStore((s) => s.user)
  if (user) return <Navigate to="/app" replace />
  return <AuthPage />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route element={<AppLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/categories" element={<CategoryPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
