import { useBookmarkStore } from '../../store/useBookmarkStore'

export function StatsBar() {
  const bookmarks = useBookmarkStore((s) => s.bookmarks)
  const favourites = bookmarks.filter((b) => b.isFavourite).length
  const categories = new Set(bookmarks.map((b) => b.category)).size

  const stats = [
    { label: 'Total Bookmarks', value: bookmarks.length, icon: '📚' },
    { label: 'Favourites', value: favourites, icon: '❤️' },
    { label: 'Categories', value: categories, icon: '🗂️' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-surface-lowest rounded-2xl p-6 shadow-[0_8px_32px_rgba(26,28,31,0.04)] flex items-center gap-4">
          <span className="text-3xl">{stat.icon}</span>
          <div>
            <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
            <p className="text-sm text-on-surface-variant">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
