export function Footer() {
  return (
    <footer className="bg-surface-high py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-on-surface-variant">
          © 2026 HippoMark. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {['Privacy', 'Terms', 'Twitter', 'Support'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
