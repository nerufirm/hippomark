export interface Category {
  id: string
  name: string
  icon: string
  color: string
  bookmarkCount: number
}

export const MOCK_CATEGORIES: Category[] = [
  { id: 'dev', name: '開発', icon: '💻', color: '#0058bc', bookmarkCount: 4 },
  { id: 'design', name: 'デザイン', icon: '🎨', color: '#9e3d00', bookmarkCount: 2 },
  { id: 'reading', name: '読み物', icon: '📖', color: '#27AE60', bookmarkCount: 2 },
  { id: 'tools', name: 'ツール', icon: '🔧', color: '#8E44AD', bookmarkCount: 2 },
  { id: 'news', name: 'ニュース', icon: '📰', color: '#E74C3C', bookmarkCount: 1 },
  { id: 'misc', name: 'その他', icon: '📌', color: '#717786', bookmarkCount: 0 },
]
