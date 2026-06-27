import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-rcms-primary hover:bg-rcms-primary-hover text-white shadow-sm shadow-rcms-primary/20',
  secondary: 'bg-rcms-raised border border-rcms-border text-slate-200 hover:bg-slate-700/50 hover:border-slate-500',
  ghost: 'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-rcms-raised',
  danger: 'bg-rcms-danger/10 border border-rcms-danger/30 text-rcms-danger hover:bg-rcms-danger/20',
}
const SIZES: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-md',
  md: 'text-sm px-4 py-2 gap-2 rounded-lg',
  lg: 'text-sm px-5 py-2.5 gap-2 rounded-lg',
}

export function Button({ variant = 'secondary', size = 'md', loading = false, icon, iconRight, children, disabled, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={['inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-rcms-primary focus:ring-offset-2 focus:ring-offset-rcms-bg', VARIANTS[variant], SIZES[size], className].join(' ')}
    >
      {loading ? (
        <svg className="animate-spin h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
      {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
    </button>
  )
}
