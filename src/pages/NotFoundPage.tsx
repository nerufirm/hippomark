import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <main className="min-h-screen bg-surface flex flex-col items-center justify-center gap-6 text-center px-6">
      <span className="text-8xl">🦛</span>
      <h1 className="text-[2rem] font-bold text-on-surface">Page not found</h1>
      <p className="text-on-surface-variant">Even our hippo can't find this page.</p>
      <Button variant="primary" onClick={() => navigate('/')}>Go Home</Button>
    </main>
  )
}
