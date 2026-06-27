import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { useSyncStore } from '@/stores/sync.store'
import { timeAgo } from '@/utils/dateHelpers'

interface SyncStatusBarProps {
  onSync?: () => void
  compact?: boolean
}

export function SyncStatusBar({ onSync, compact = false }: SyncStatusBarProps) {
  const { status, lastSyncedAt, errorMessage } = useSyncStore()

  if (compact) {
    return (
      <button
        onClick={onSync}
        disabled={status === 'syncing'}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
      >
        {status === 'syncing' ? (
          <RefreshCw className="h-3 w-3 animate-spin text-rcms-primary" />
        ) : status === 'error' ? (
          <AlertCircle className="h-3 w-3 text-rcms-danger" />
        ) : (
          <Clock className="h-3 w-3" />
        )}
        {status === 'syncing'
          ? 'Syncing…'
          : lastSyncedAt
          ? timeAgo(lastSyncedAt)
          : 'Not synced'}
      </button>
    )
  }

  return (
    <div className={['flex items-center gap-2 px-3 py-2 rounded-lg border text-xs', status === 'error' ? 'border-rcms-danger/30 bg-rcms-danger/5 text-rcms-danger' : status === 'syncing' ? 'border-rcms-primary/30 bg-rcms-primary/5 text-rcms-primary-light' : 'border-rcms-border bg-rcms-raised text-slate-400'].join(' ')}>
      {status === 'syncing' ? (
        <RefreshCw className="h-3 w-3 animate-spin shrink-0" />
      ) : status === 'error' ? (
        <AlertCircle className="h-3 w-3 shrink-0" />
      ) : (
        <CheckCircle className="h-3 w-3 shrink-0" />
      )}
      <span className="flex-1">
        {status === 'syncing' ? 'Syncing from Google Sheets…' : status === 'error' ? (errorMessage ?? 'Sync failed') : lastSyncedAt ? 'Synced ' + timeAgo(lastSyncedAt) : 'Not yet synced'}
      </span>
      {onSync && status !== 'syncing' && (
        <button onClick={onSync} className="hover:text-slate-200 transition-colors underline underline-offset-2">
          Sync now
        </button>
      )}
    </div>
  )
}
