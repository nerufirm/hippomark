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
