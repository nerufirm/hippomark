import { create } from 'zustand'
import type { Bookmark } from '../types/bookmark'

const MOCK_BOOKMARKS: Bookmark[] = [
  {
    id: '1',
    title: 'React Documentation',
    url: 'https://react.dev',
    description: 'The official React documentation.',
    category: 'dev',
    isFavourite: true,
    createdAt: '2024-01-01T00:00:00Z',
    tags: ['react', 'docs'],
  },
  {
    id: '2',
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    description: 'A utility-first CSS framework.',
    category: 'design',
    isFavourite: false,
    createdAt: '2024-01-02T00:00:00Z',
    tags: ['css', 'tailwind'],
  },
  {
    id: '3',
    title: 'Vite',
    url: 'https://vitejs.dev',
    description: 'Next generation frontend tooling.',
    category: 'dev',
    isFavourite: true,
    createdAt: '2024-01-03T00:00:00Z',
    tags: ['vite', 'build'],
  },
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

export const useBookmarkStore = create<BookmarkStore>((set) => ({
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
}))

export function useFilteredBookmarks() {
  return useBookmarkStore((state) => {
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
}
