import type { Bookmark } from '../../types/bookmark'
import { useBookmarkStore } from '../../store/useBookmarkStore'

interface BookmarkCardProps {
  bookmark: Bookmark
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const { toggleFavourite, deleteBookmark } = useBookmarkStore()

  return (
    <div className="bg-surface-lowest rounded-2xl p-5 shadow-[0_8px_32px_rgba(26,28,31,0.04)] flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-on-surface leading-tight truncate">{bookmark.title}</h3>
        <button
          onClick={() => toggleFavourite(bookmark.id)}
          aria-label={bookmark.isFavourite ? 'お気に入りを解除' : 'お気に入りに追加'}
          className="flex-shrink-0 text-xl leading-none hover:scale-110 transition-transform"
        >
          {bookmark.isFavourite ? '❤️' : '🤍'}
        </button>
      </div>

      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-on-surface-variant uppercase tracking-[0.05em] truncate hover:text-primary transition-colors"
      >
        {bookmark.url}
      </a>

      {bookmark.description && (
        <p className="text-sm text-on-surface-variant leading-[1.6] line-clamp-2">
          {bookmark.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 mt-1">
        <span className="bg-primary-fixed text-primary text-xs font-medium px-3 py-1 rounded-full">
          {bookmark.category}
        </span>
        <button
          onClick={() => deleteBookmark(bookmark.id)}
          aria-label="ブックマークを削除"
          className="text-xs text-on-surface-variant hover:text-error transition-colors"
        >
          削除
        </button>
      </div>
    </div>
  )
}
