import { Menu, RefreshCw } from 'lucide-react'
import { useUIStore } from '@/stores/ui.store'
import { useSyncStore } from '@/stores/sync.store'

interface TopBarProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  onSync?: () => void
}

export function TopBar({ title, subtitle, actions, onSync }: TopBarProps) {
  const { toggleSidebar } = useUIStore()
  const { status, lastSyncedAt } = useSyncStore()

  return (
    <header className="h-16 border-b border-rcms-border bg-rcms-bg/80 backdrop-blur-sm flex items-center px-4 md:px-6 gap-4 sticky top-0 z-20">
      {/* Mobile hamburger */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-rcms-raised transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-slate-100 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
      </div>

      {/* Sync indicator (desktop) */}
      {(onSync || lastSyncedAt) && (
        <button
          onClick={onSync}
          disabled={status === 'syncing'}
          className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50 px-2 py-1.5 rounded-lg hover:bg-rcms-raised"
        >
          <RefreshCw className={['h-3 w-3', status === 'syncing' ? 'animate-spin text-rcms-primary' : ''].join(' ')} />
          <span>{status === 'syncing' ? 'Syncing…' : 'Sync'}</span>
        </button>
      )}

      {/* Page actions */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
