import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'

const NAV_LINKS = [
  { to: '/app', label: 'All Bookmarks' },
  { to: '/app?filter=recent', label: 'Recent' },
  { to: '/app?filter=favourites', label: 'Favorites' },
  { to: '/categories', label: 'Categories' },
]

export function Navbar() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-bold text-xl text-on-surface tracking-tight cursor-pointer bg-transparent border-0"
          aria-label="HippoMark home"
        >
          <span className="text-2xl">🦛</span>
          <span>HippoMark</span>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-high'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-high transition-colors"
            aria-label="Search"
          >
            🔍
          </button>
          <Button variant="primary" size="sm" onClick={() => navigate('/app')}>
            + Add Bookmark
          </Button>
          <button
            className="w-8 h-8 rounded-full bg-primary text-white text-sm font-medium flex items-center justify-center"
            aria-label="Account"
          >
            H
          </button>
          {/* Hamburger (mobile) */}
          <button
            className="md:hidden p-2 rounded-full text-on-surface-variant hover:bg-surface-high transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-outline-variant/15 px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-high'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
