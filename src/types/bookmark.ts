export interface Bookmark {
  id: string
  title: string
  url: string
  description?: string
  category: string
  isFavourite: boolean
  createdAt: string
  tags: string[]
}
