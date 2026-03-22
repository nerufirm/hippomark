interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const variantClasses = {
  primary:
    'bg-gradient-to-br from-primary to-primary-container text-white hover:opacity-90 disabled:opacity-50',
  secondary:
    'bg-surface-highest text-on-surface hover:bg-surface-dim disabled:opacity-50',
  ghost:
    'bg-transparent text-primary hover:bg-primary/5 disabled:opacity-50',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled,
  className = '',
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
