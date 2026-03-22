# 認証 + ブックマーク追加機能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** HippoMark にモック認証（アカウント登録・ログイン）とブックマーク追加モーダルを追加し、両方を localStorage で永続化する。

**Architecture:** `useAuthStore`（zustand + persist）でユーザー認証状態を管理、パスワードは `crypto.subtle` SHA-256 でハッシュ化して保存。`useBookmarkStore` に `persist` を追加してブックマークを永続化。認証が必要なルートは `ProtectedRoute` でガード。ブックマーク追加はNavbarの「+ 追加」ボタンからオーバーレイモーダルで行う。

**Tech Stack:** Vite 5, React 18, TypeScript 5, Tailwind CSS 3, React Router 6, Zustand 4, zustand/middleware (persist)

---

## File Map

| ファイル | 操作 | 責務 |
|---------|------|------|
| `src/store/useAuthStore.ts` | 新規 | 認証状態・登録ユーザー管理、SHA-256ハッシュ化、persist |
| `src/store/useBookmarkStore.ts` | 変更 | persist middleware追加 |
| `src/pages/AuthPage.tsx` | 新規 | ログイン/登録ページ（タブ切り替え、グラスモーフィズム） |
| `src/components/layout/ProtectedRoute.tsx` | 新規 | 未ログイン時 /login へリダイレクト |
| `src/components/app/AddBookmarkModal.tsx` | 新規 | ブックマーク追加オーバーレイモーダル |
| `src/components/layout/Navbar.tsx` | 変更 | モーダル開閉、アバタードロップダウン（ログアウト） |
| `src/App.tsx` | 変更 | /login ルート追加、ProtectedRoute でガード |

---

## Task 1: useAuthStore — 認証ストア作成

**Files:**
- Create: `src/store/useAuthStore.ts`

- [ ] **Step 1: `src/store/useAuthStore.ts` を作成**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  email: string
  name: string
}

interface RegisteredUser {
  email: string
  name: string
  passwordHash: string
}

interface AuthStore {
  user: User | null
  registeredUsers: RegisteredUser[]
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

async function hashPassword(password: string): Promise<string> {
  const encoded = new TextEncoder().encode(password)
  const buffer = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      registeredUsers: [],

      login: async (email, password) => {
        const hash = await hashPassword(password)
        const found = get().registeredUsers.find(
          (u) => u.email === email && u.passwordHash === hash
        )
        if (!found) {
          return { success: false, error: 'メールアドレスまたはパスワードが正しくありません' }
        }
        set({ user: { email: found.email, name: found.name } })
        return { success: true }
      },

      register: async (email, name, password) => {
        if (get().registeredUsers.some((u) => u.email === email)) {
          return { success: false, error: 'このメールアドレスはすでに登録されています' }
        }
        if (password.length < 6) {
          return { success: false, error: 'パスワードは6文字以上で入力してください' }
        }
        if (name.trim().length === 0) {
          return { success: false, error: '名前を入力してください' }
        }
        const passwordHash = await hashPassword(password)
        const newUser: RegisteredUser = { email, name: name.trim(), passwordHash }
        set((state) => ({
          registeredUsers: [...state.registeredUsers, newUser],
          user: { email, name: name.trim() },
        }))
        return { success: true }
      },

      logout: () => set({ user: null }),
    }),
    { name: 'hippomark-auth' }
  )
)
```

- [ ] **Step 2: コミット**

```bash
cd /Users/nerufirm/開発/hippomark
git add src/store/useAuthStore.ts
git commit -m "feat: add useAuthStore with SHA-256 password hashing and localStorage persist"
```

> **Note:** `localStorage.setItem` が `QuotaExceededError` をスローするケースは、スペックに従い本実装ではスコープ外とする（コンソールエラーのみ。UIトーストは将来対応）。

---

## Task 2: useBookmarkStore に persist を追加

**Files:**
- Modify: `src/store/useBookmarkStore.ts`

- [ ] **Step 1: `persist` middleware をインポートし、`create` をラップする**

現在の `src/store/useBookmarkStore.ts` を以下のように変更する。`import { persist } from 'zustand/middleware'` を追加し、`create<BookmarkStore>((set) => ({...}))` を `create<BookmarkStore>()(persist((set) => ({...}), { name: 'hippomark-bookmarks' }))` に変更する。

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { Bookmark } from '../types/bookmark'

const MOCK_BOOKMARKS: Bookmark[] = [
  { id: '1', title: 'React ドキュメント', url: 'https://react.dev', description: 'React公式ドキュメント', category: 'dev', isFavourite: true, createdAt: '2026-03-01', tags: ['react', 'docs'] },
  { id: '2', title: 'Tailwind CSS', url: 'https://tailwindcss.com', description: 'ユーティリティファーストCSSフレームワーク', category: 'design', isFavourite: false, createdAt: '2026-03-02', tags: ['css', 'tailwind'] },
  { id: '3', title: 'Vite', url: 'https://vitejs.dev', description: '次世代フロントエンドツール', category: 'dev', isFavourite: true, createdAt: '2026-03-03', tags: ['vite', 'build'] },
  { id: '4', title: 'TypeScript ハンドブック', url: 'https://typescriptlang.org/docs', description: 'TypeScript公式ドキュメント', category: 'dev', isFavourite: false, createdAt: '2026-03-04', tags: ['typescript'] },
  { id: '5', title: 'Figma', url: 'https://figma.com', description: 'デザインツール', category: 'design', isFavourite: true, createdAt: '2026-03-05', tags: ['design', 'tool'] },
  { id: '6', title: 'GitHub', url: 'https://github.com', description: 'コードホスティング', category: 'tools', isFavourite: true, createdAt: '2026-03-06', tags: ['git', 'code'] },
  { id: '7', title: 'Vercel', url: 'https://vercel.com', description: 'フロントエンドデプロイサービス', category: 'tools', isFavourite: false, createdAt: '2026-03-07', tags: ['deploy', 'hosting'] },
  { id: '8', title: 'Hacker News', url: 'https://news.ycombinator.com', description: 'テックニュース', category: 'news', isFavourite: false, createdAt: '2026-03-08', tags: ['news'] },
  { id: '9', title: 'Zenn', url: 'https://zenn.dev', description: '日本のエンジニア向け情報共有サービス', category: 'reading', isFavourite: true, createdAt: '2026-03-09', tags: ['tech', 'japanese'] },
  { id: '10', title: 'Qiita', url: 'https://qiita.com', description: 'エンジニアの知識共有コミュニティ', category: 'reading', isFavourite: false, createdAt: '2026-03-10', tags: ['tech', 'japanese'] },
]

interface BookmarkStore {
  bookmarks: Bookmark[]
  searchQuery: string
  activeCategory: string | null
  setSearchQuery: (q: string) => void
  setActiveCategory: (id: string | null) => void
  toggleFavourite: (id: string) => void
  deleteBookmark: (id: string) => void
  addBookmark: (bookmark: Bookmark) => void
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarks: MOCK_BOOKMARKS,
      searchQuery: '',
      activeCategory: null,
      setSearchQuery: (q) => set({ searchQuery: q }),
      setActiveCategory: (id) => set({ activeCategory: id }),
      toggleFavourite: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === id ? { ...b, isFavourite: !b.isFavourite } : b
          ),
        })),
      deleteBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),
      addBookmark: (bookmark) =>
        set((state) => ({ bookmarks: [bookmark, ...state.bookmarks] })),
    }),
    {
      name: 'hippomark-bookmarks',
      // searchQuery と activeCategory は永続化しない（UI状態のため）
      partialize: (state) => ({ bookmarks: state.bookmarks }),
    }
  )
)

export function useFilteredBookmarks() {
  return useBookmarkStore(
    useShallow((state) => {
      const { bookmarks, searchQuery, activeCategory } = state
      return bookmarks.filter((b) => {
        const matchesCategory = !activeCategory || b.category === activeCategory
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          !q ||
          b.title.toLowerCase().includes(q) ||
          b.url.toLowerCase().includes(q) ||
          (b.description?.toLowerCase().includes(q) ?? false) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
        return matchesCategory && matchesSearch
      })
    })
  )
}
```

- [ ] **Step 2: ビルドが通ることを確認**

```bash
cd /Users/nerufirm/開発/hippomark
pnpm build
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add src/store/useBookmarkStore.ts
git commit -m "feat: add persist middleware to useBookmarkStore (key: hippomark-bookmarks)"
```

---

## Task 2.5: Tailwind カスタムトークン確認

**Files:**
- Read: `tailwind.config.ts`

- [ ] **Step 1: 以下のトークンが `tailwind.config.ts` に定義されていることを確認**

```bash
grep -E "surface-low|surface-dim|error|primary-container" /Users/nerufirm/開発/hippomark/tailwind.config.ts
```

Expected: `surface-low`, `surface-dim`, `error`, `primary-container` が全て出力される。
もし欠けているトークンがあれば `tailwind.config.ts` の `colors` に追加してからコミットする。

---

## Task 3: ProtectedRoute コンポーネント

**Files:**
- Create: `src/components/layout/ProtectedRoute.tsx`

- [ ] **Step 1: `src/components/layout/ProtectedRoute.tsx` を作成**

```tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

export function ProtectedRoute() {
  const user = useAuthStore((s) => s.user)
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
```

- [ ] **Step 2: コミット**

```bash
git add src/components/layout/ProtectedRoute.tsx
git commit -m "feat: add ProtectedRoute component"
```

---

## Task 4: AuthPage — ログイン/登録ページ

**Files:**
- Create: `src/pages/AuthPage.tsx`

- [ ] **Step 1: `src/pages/AuthPage.tsx` を作成**

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

type Tab = 'login' | 'register'

export function AuthPage() {
  const navigate = useNavigate()
  const { login, register } = useAuthStore()
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result =
        tab === 'login'
          ? await login(email, password)
          : await register(email, name, password)
      if (result.success) {
        navigate('/app')
      } else {
        setError(result.error ?? 'エラーが発生しました')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl">🦛</span>
          <p className="text-white font-bold text-xl mt-2">HippoMark</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/10 rounded-full p-1 mb-6">
          {(['login', 'register'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-white text-primary shadow'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {t === 'login' ? 'ログイン' : '新規登録'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === 'register' && (
            <div>
              <label className="block text-white/70 text-xs mb-1">名前</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="山田 太郎"
                required
                className="w-full bg-white/15 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/60 transition-colors text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-white/70 text-xs mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-white/15 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/60 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-white/70 text-xs mb-1">パスワード{tab === 'register' && '（6文字以上）'}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-white/15 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/60 transition-colors text-sm"
            />
          </div>

          {error && (
            <p className="text-red-300 text-xs bg-red-500/20 border border-red-400/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-primary font-semibold py-3 rounded-full text-sm hover:bg-surface-low transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? '処理中...' : tab === 'login' ? 'ログイン' : 'アカウント作成'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: コミット**

```bash
git add src/pages/AuthPage.tsx
git commit -m "feat: add AuthPage with glassmorphism login/register UI"
```

---

## Task 5: AddBookmarkModal — ブックマーク追加モーダル

**Files:**
- Create: `src/components/app/AddBookmarkModal.tsx`

- [ ] **Step 1: `src/components/app/AddBookmarkModal.tsx` を作成**

```tsx
import { useState, useEffect, useRef } from 'react'
import { useBookmarkStore } from '../../store/useBookmarkStore'
import { MOCK_CATEGORIES } from '../../data/categories'

interface AddBookmarkModalProps {
  onClose: () => void
}

function isValidUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

export function AddBookmarkModal({ onClose }: AddBookmarkModalProps) {
  const addBookmark = useBookmarkStore((s) => s.addBookmark)
  const overlayRef = useRef<HTMLDivElement>(null)

  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(MOCK_CATEGORIES[0].id)
  const [urlError, setUrlError] = useState('')

  // ESC キーで閉じる
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidUrl(url)) {
      setUrlError('URL は http:// または https:// で始まる必要があります')
      return
    }
    setUrlError('')

    let resolvedTitle = title.trim()
    if (!resolvedTitle) {
      try {
        resolvedTitle = new URL(url).hostname
      } catch {
        resolvedTitle = url
      }
    }

    addBookmark({
      id: crypto.randomUUID(),
      title: resolvedTitle,
      url,
      description: description.trim() || undefined,
      category,
      isFavourite: false,
      createdAt: new Date().toISOString(),
      tags: [],
    })

    onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
    >
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-on-surface">ブックマークを追加</h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors text-xl leading-none"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              URL <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setUrlError('') }}
              placeholder="https://example.com"
              required
              autoFocus
              className="w-full bg-surface-high rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
            {urlError && (
              <p className="text-error text-xs mt-1">{urlError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              タイトル <span className="text-on-surface-variant font-normal">（空の場合はURLから自動設定）</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ページタイトル"
              className="w-full bg-surface-high rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">説明</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="メモや説明（任意）"
              rows={2}
              className="w-full bg-surface-high rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              カテゴリ <span className="text-error">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface-high rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            >
              {MOCK_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full text-sm font-medium text-on-surface-variant bg-surface-high hover:bg-surface-dim transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-br from-primary to-primary-container hover:opacity-90 transition-opacity"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: コミット**

```bash
git add src/components/app/AddBookmarkModal.tsx
git commit -m "feat: add AddBookmarkModal with overlay, ESC close, URL validation"
```

---

## Task 6: Navbar を更新（モーダル開閉 + アバタードロップダウン）

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: `src/components/layout/Navbar.tsx` を以下に置き換える**

```tsx
import { useState, useEffect, useRef } from 'react'
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

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

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
              aria-label="検索"
            >
              🔍
            </button>
            <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
              + 追加
            </Button>

            {/* Avatar + Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="w-8 h-8 rounded-full bg-primary text-white text-sm font-medium flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="アカウントメニュー"
              >
                {avatarLabel}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-10 w-52 bg-white rounded-2xl shadow-[0_8px_32px_rgba(26,28,31,0.12)] border border-outline-variant/20 py-2 z-50">
                  {user && (
                    <div className="px-4 py-3 border-b border-outline-variant/15">
                      <p className="text-sm font-semibold text-on-surface truncate">{user.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-error hover:bg-surface-low transition-colors"
                  >
                    ログアウト
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger (mobile) */}
            <button
              className="md:hidden p-2 rounded-full text-on-surface-variant hover:bg-surface-high transition-colors"
              aria-label={mobileOpen ? 'メニューを閉じる' : 'メニューを開く'}
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

      {/* Add Bookmark Modal */}
      {modalOpen && <AddBookmarkModal onClose={() => setModalOpen(false)} />}
    </>
  )
}
```

- [ ] **Step 2: コミット**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat: add modal trigger and account dropdown with logout to Navbar"
```

---

## Task 7: App.tsx — ルーティング更新

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: `src/App.tsx` を以下に置き換える**

```tsx
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
```

- [ ] **Step 2: ビルドが通ることを確認**

```bash
cd /Users/nerufirm/開発/hippomark
pnpm build
```

Expected: エラーなし、`dist/` 生成

- [ ] **Step 3: コミット**

```bash
git add src/App.tsx
git commit -m "feat: add /login route and ProtectedRoute guards to App.tsx"
```

---

## Task 8: 動作確認

- [ ] **Step 1: 開発サーバーを起動（既に起動中なら不要）**

```bash
cd /Users/nerufirm/開発/hippomark
pnpm dev
```

- [ ] **Step 2: 以下を確認**

| 確認項目 | 期待結果 |
|---------|---------|
| `/app` を未ログインで開く | `/login` にリダイレクトされる |
| 新規登録（名前・メール・パスワード6文字以上） | 登録後 `/app` に遷移 |
| ログアウト（アバタードロップダウン） | `/` に戻る |
| 再ログイン | 同じ認証情報でログイン可能 |
| `+ 追加` ボタン | モーダルが開く |
| URLなし or 不正URLで保存 | エラーメッセージが表示される |
| 正常なURL入力で保存 | 一覧の先頭にカードが追加される |
| ブラウザリロード | ブックマークと認証状態が保持される |
| ESCキー or オーバーレイクリック | モーダルが閉じる |

- [ ] **Step 3: 最終コミット**

```bash
git add .
git commit -m "chore: verify auth and bookmark-add feature complete"
```
