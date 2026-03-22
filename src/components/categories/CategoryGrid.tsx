import { useNavigate } from 'react-router-dom'
import { useBookmarkStore } from '../../store/useBookmarkStore'
import { MOCK_CATEGORIES } from '../../data/categories'

export function CategoryGrid() {
  const navigate = useNavigate()
  const setActiveCategory = useBookmarkStore((s) => s.setActiveCategory)

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id)
    navigate('/app')
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleCategoryClick(cat.id)}
          className="bg-surface-lowest rounded-2xl p-8 shadow-[0_8px_32px_rgba(26,28,31,0.04)] flex flex-col gap-4 text-left hover:shadow-[0_12px_40px_rgba(26,28,31,0.08)] transition-shadow cursor-pointer"
        >
          <span className="text-4xl">{cat.icon}</span>
          <div>
            <h3 className="font-semibold text-on-surface text-lg">{cat.name}</h3>
            <p className="text-sm text-on-surface-variant">{cat.bookmarkCount} bookmarks</p>
          </div>
          <div
            className="h-1 rounded-full w-12"
            style={{ backgroundColor: cat.color }}
          />
        </button>
      ))}
    </div>
  )
}
