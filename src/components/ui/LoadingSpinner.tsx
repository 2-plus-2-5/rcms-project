interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}
const SIZES = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' }

export function LoadingSpinner({ message, size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <svg className={['animate-spin text-rcms-primary', SIZES[size]].join(' ')} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {message && <p className="text-sm text-slate-500 animate-pulse">{message}</p>}
    </div>
  )
}
