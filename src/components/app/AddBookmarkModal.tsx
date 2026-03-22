import { useState, useEffect, useRef } from 'react'
import { useBookmarkStore } from '../../store/useBookmarkStore'
import { MOCK_CATEGORIES } from '../../data/categories'

interface AddBookmarkModalProps {
  onClose: () => void
}

function isValidUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

export function AddBookmarkModal({ onClose }: AddBookmarkModalProps) {
  const addBookmark = useBookmarkStore((s) => s.addBookmark)
  const overlayRef = useRef<HTMLDivElement>(null)

  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(MOCK_CATEGORIES[0].id)
  const [urlError, setUrlError] = useState('')

  // ESC キーで閉じる
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidUrl(url)) {
      setUrlError('URL は http:// または https:// で始まる必要があります')
      return
    }
    setUrlError('')

    let resolvedTitle = title.trim()
    if (!resolvedTitle) {
      try {
        resolvedTitle = new URL(url).hostname
      } catch {
        resolvedTitle = url
      }
    }

    addBookmark({
      id: crypto.randomUUID(),
      title: resolvedTitle,
      url,
      description: description.trim() || undefined,
      category,
      isFavourite: false,
      createdAt: new Date().toISOString(),
      tags: [],
    })

    onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
    >
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-on-surface">ブックマークを追加</h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors text-xl leading-none"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              URL <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setUrlError('') }}
              placeholder="https://example.com"
              required
              autoFocus
              className="w-full bg-surface-high rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
            {urlError && (
              <p className="text-error text-xs mt-1">{urlError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              タイトル <span className="text-on-surface-variant font-normal">（空の場合はURLから自動設定）</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ページタイトル"
              className="w-full bg-surface-high rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">説明</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="メモや説明（任意）"
              rows={2}
              className="w-full bg-surface-high rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              カテゴリ <span className="text-error">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface-high rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            >
              {MOCK_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full text-sm font-medium text-on-surface-variant bg-surface-high hover:bg-surface-dim transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-br from-primary to-primary-container hover:opacity-90 transition-opacity"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
