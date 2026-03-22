import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { SearchBar } from '../components/app/SearchBar'
import { BookmarkCard } from '../components/app/BookmarkCard'
import { useBookmarkStore, useFilteredBookmarks } from '../store/useBookmarkStore'
import { MOCK_CATEGORIES } from '../data/categories'

export function AppPage() {
  const { searchQuery, activeCategory, setSearchQuery, setActiveCategory } = useBookmarkStore(
    useShallow((s) => ({
      searchQuery: s.searchQuery,
      activeCategory: s.activeCategory,
      setSearchQuery: s.setSearchQuery,
      setActiveCategory: s.setActiveCategory,
    }))
  )
  const bookmarks = useFilteredBookmarks()

  useEffect(() => {
    document.title = 'ブックマーク一覧 — HippoMark'
  }, [])

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col gap-1 p-6 bg-surface-low">
        <h2 className="text-xs font-medium uppercase tracking-[0.05em] text-on-surface-variant mb-3">
          カテゴリ
        </h2>
        <button
          onClick={() => setActiveCategory(null)}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
            !activeCategory ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span>📚</span> すべて
        </button>
        {MOCK_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
              activeCategory === cat.id
                ? 'bg-primary/10 text-primary'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span>{cat.icon}</span> {cat.name}
            <span className="ml-auto text-xs text-on-surface-variant">{cat.bookmarkCount}</span>
          </button>
        ))}
      </aside>

      <main className="flex-1 p-8 flex flex-col gap-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {bookmarks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-24">
            <span className="text-6xl">🦛</span>
            <p className="text-on-surface-variant">ブックマークがありません。最初の1件を追加しましょう！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
