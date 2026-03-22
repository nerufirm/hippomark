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
