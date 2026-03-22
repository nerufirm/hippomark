interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'ブックマークを検索...' }: SearchBarProps) {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-4 text-on-surface-variant" aria-hidden="true">🔍</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search bookmarks"
        className="w-full bg-surface-high rounded-xl pl-12 pr-10 py-3 text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 text-on-surface-variant hover:text-on-surface"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  )
}
