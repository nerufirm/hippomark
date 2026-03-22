import { useEffect } from 'react'
import { CategoryGrid } from '../components/categories/CategoryGrid'

export function CategoryPage() {
  useEffect(() => {
    document.title = 'カテゴリ — HippoMark'
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8">
      <h1 className="text-[2rem] font-bold text-on-surface tracking-[-0.02em]">カテゴリ</h1>
      <CategoryGrid />
    </main>
  )
}
