export interface Category {
  id: string
  name: string
  icon: string
  color: string
  bookmarkCount: number
}

export const MOCK_CATEGORIES: Category[] = [
  { id: 'dev', name: 'Development', icon: '💻', color: '#4A90E2', bookmarkCount: 12 },
  { id: 'design', name: 'Design', icon: '🎨', color: '#F39C12', bookmarkCount: 8 },
  { id: 'reading', name: 'Reading', icon: '📖', color: '#27AE60', bookmarkCount: 5 },
  { id: 'tools', name: 'Tools', icon: '🔧', color: '#8E44AD', bookmarkCount: 7 },
  { id: 'news', name: 'News', icon: '📰', color: '#E74C3C', bookmarkCount: 3 },
  { id: 'misc', name: 'Miscellaneous', icon: '📦', color: '#95A5A6', bookmarkCount: 4 },
]
