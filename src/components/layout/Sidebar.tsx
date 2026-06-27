import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Settings, BookOpen, RefreshCw } from 'lucide-react'
import { useSyncStore } from '@/stores/sync.store'
import { timeAgo } from '@/utils/dateHelpers'

const NAV_ITEMS = [
  { to: '/',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/members', icon: Users,           label: 'Members'   },
  { to: '/settings',icon: Settings,        label: 'Settings'  },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation()
  const { status, lastSyncedAt } = useSyncStore()

  return (
    <div className="h-full flex flex-col bg-rcms-surface border-r border-rcms-border w-64">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-rcms-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rcms-primary flex items-center justify-center shrink-0">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100 leading-none">RCMS</div>
            <div className="text-xs text-slate-500 mt-0.5">Reading Community</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <div className="section-label px-3 mb-2">Navigation</div>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={['nav-link', isActive ? 'active' : ''].join(' ')}
            >
              <Icon className={['nav-icon h-4 w-4 shrink-0', isActive ? 'text-rcms-primary' : 'text-slate-500'].join(' ')} />
              <span>{label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Sync status at bottom */}
      <div className="px-4 pb-5 pt-3 border-t border-rcms-border">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <RefreshCw className={['h-3 w-3 shrink-0', status === 'syncing' ? 'animate-spin text-rcms-primary' : ''].join(' ')} />
          <span>
            {status === 'syncing'
              ? 'Syncing…'
              : lastSyncedAt
              ? 'Synced ' + timeAgo(lastSyncedAt)
              : 'Not synced'}
          </span>
        </div>
        <div className="mt-1 text-xs text-slate-600">v1.0.0 · Milestone 1</div>
      </div>
    </div>
  )
}
