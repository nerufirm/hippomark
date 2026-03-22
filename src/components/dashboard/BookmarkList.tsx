import { useBookmarkStore } from '../../store/useBookmarkStore'

export function BookmarkList() {
  const bookmarks = useBookmarkStore((s) => s.bookmarks.slice(0, 8))
  const toggleFavourite = useBookmarkStore((s) => s.toggleFavourite)

  return (
    <div className="bg-surface-low rounded-2xl overflow-hidden">
      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="flex items-center gap-4 px-6 py-4 bg-surface-lowest mb-2 rounded-xl mx-2"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium text-on-surface truncate">{b.title}</p>
            <p className="text-xs text-on-surface-variant uppercase tracking-[0.05em] truncate">{b.url}</p>
          </div>
          <span className="text-xs bg-primary-fixed text-primary px-2 py-0.5 rounded-full">
            {b.category}
          </span>
          <button
            onClick={() => toggleFavourite(b.id)}
            aria-label={b.isFavourite ? 'お気に入り解除' : 'お気に入り追加'}
          >
            {b.isFavourite ? '❤️' : '🤍'}
          </button>
        </div>
      ))}
    </div>
  )
}
