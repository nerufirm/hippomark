import { useEffect } from 'react'
import { StatsBar } from '../components/dashboard/StatsBar'
import { BookmarkList } from '../components/dashboard/BookmarkList'

export function DashboardPage() {
  useEffect(() => {
    document.title = 'ダッシュボード — HippoMark'
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8">
      <h1 className="text-[2rem] font-bold text-on-surface tracking-[-0.02em]">ダッシュボード</h1>
      <StatsBar />
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-on-surface">最近のブックマーク</h2>
        <BookmarkList />
      </section>
    </main>
  )
}
