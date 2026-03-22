import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAuthStore } from '../../store/useAuthStore'
import { AddBookmarkModal } from '../app/AddBookmarkModal'

const NAV_LINKS = [
  { to: '/app', label: 'ブックマーク一覧' },
  { to: '/app?filter=recent', label: '最近' },
  { to: '/app?filter=favourites', label: 'お気に入り' },
  { to: '/categories', label: 'カテゴリ' },
]

export function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const avatarButtonRef = useRef<HTMLButtonElement>(null)

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false)
    avatarButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dropdownOpen) {
        closeDropdown()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [closeDropdown, dropdownOpen])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  const avatarLabel = user ? user.name.charAt(0).toUpperCase() : 'H'

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-bold text-xl text-on-surface tracking-tight cursor-pointer bg-transparent border-0"
            aria-label="HippoMark home"
          >
            <span className="text-2xl">🦛</span>
            <span>HippoMark</span>
          </button>

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

          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-full text-on-surface-variant hover:bg-surface-high transition-colors"
              aria-label="検索"
            >
              🔍
            </button>
            <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
              + 追加
            </Button>

            <div className="relative" ref={dropdownRef}>
              <button
                ref={avatarButtonRef}
                onClick={() => setDropdownOpen((v) => !v)}
                className="w-8 h-8 rounded-full bg-primary text-white text-sm font-medium flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="アカウントメニュー"
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
              >
                {avatarLabel}
              </button>

              {dropdownOpen && (
                <div role="menu" className="absolute right-0 top-10 w-52 bg-white rounded-2xl shadow-[0_8px_32px_rgba(26,28,31,0.12)] border border-outline-variant/20 py-2 z-50">
                  {user && (
                    <div className="px-4 py-3 border-b border-outline-variant/15">
                      <p className="text-sm font-semibold text-on-surface truncate">{user.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                    </div>
                  )}
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-error hover:bg-surface-low transition-colors"
                  >
                    ログアウト
                  </button>
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-full text-on-surface-variant hover:bg-surface-high transition-colors"
              aria-label={mobileOpen ? 'メニューを閉じる' : 'メニューを開く'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

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

      {modalOpen && <AddBookmarkModal onClose={() => setModalOpen(false)} />}
    </>
  )
}
