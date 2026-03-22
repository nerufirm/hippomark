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
      // MOCK DATA: Pre-populated for demo purposes. On first load (no localStorage key),
      // these bookmarks appear as the user's initial data. This is intentional for the demo.
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
