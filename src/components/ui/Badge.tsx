interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary'
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}
const VARIANTS = {
  success: 'bg-rcms-success/10 text-rcms-success border-rcms-success/20',
  danger:  'bg-rcms-danger/10  text-rcms-danger  border-rcms-danger/20',
  warning: 'bg-rcms-warning/10 text-rcms-warning border-rcms-warning/20',
  info:    'bg-rcms-info/10    text-rcms-info    border-rcms-info/20',
  neutral: 'bg-slate-700/40    text-slate-300    border-slate-600/30',
  primary: 'bg-rcms-primary/10 text-rcms-primary-light border-rcms-primary/20',
}
const DOT_COLORS = {
  success: 'bg-rcms-success', danger: 'bg-rcms-danger',
  warning: 'bg-rcms-warning', info:    'bg-rcms-info',
  neutral: 'bg-slate-400',    primary: 'bg-rcms-primary',
}

export function Badge({ children, variant = 'neutral', size = 'sm', dot = false, className = '' }: BadgeProps) {
  const base = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
  return (
    <span className={['inline-flex items-center gap-1.5 font-medium rounded-full border', base, VARIANTS[variant], className].join(' ')}>
      {dot && <span className={['w-1.5 h-1.5 rounded-full shrink-0', DOT_COLORS[variant]].join(' ')} />}
      {children}
    </span>
  )
}
