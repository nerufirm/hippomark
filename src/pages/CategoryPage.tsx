import { useEffect } from 'react'
import { CategoryGrid } from '../components/categories/CategoryGrid'

export function CategoryPage() {
  useEffect(() => {
    document.title = 'Categories — HippoMark'
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8">
      <h1 className="text-[2rem] font-bold text-on-surface tracking-[-0.02em]">Categories</h1>
      <CategoryGrid />
    </main>
  )
}
