import { Routes, Route, Outlet } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { LandingPage } from './pages/LandingPage'
import { AppPage } from './pages/AppPage'
import { DashboardPage } from './pages/DashboardPage'
import { CategoryPage } from './pages/CategoryPage'
import { NotFoundPage } from './pages/NotFoundPage'

function AppLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AppLayout />}>
        <Route path="/app" element={<AppPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/categories" element={<CategoryPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
