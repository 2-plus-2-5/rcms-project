import { create } from 'zustand'
import { SyncStatus } from '@/types'

interface SyncStoreState {
  status: SyncStatus
  lastSyncedAt: string | null
  errorMessage: string | null
  recordsSynced: number

  setSyncing: () => void
  setSyncSuccess: (recordsSynced: number) => void
  setSyncError: (message: string) => void
  setLastSyncedAt: (ts: string | null) => void
}

export const useSyncStore = create<SyncStoreState>((set) => ({
  status: 'idle',
  lastSyncedAt: null,
  errorMessage: null,
  recordsSynced: 0,

  setSyncing: () => set({ status: 'syncing', errorMessage: null }),
  setSyncSuccess: (recordsSynced) =>
    set({ status: 'success', recordsSynced, lastSyncedAt: new Date().toISOString(), errorMessage: null }),
  setSyncError: (errorMessage) =>
    set({ status: 'error', errorMessage }),
  setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt }),
}))
