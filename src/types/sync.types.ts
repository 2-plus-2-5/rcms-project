export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error'

export interface SyncState {
  status: SyncStatus
  lastSyncedAt: string | null
  errorMessage: string | null
  recordsSynced: number
}

export interface SyncResult {
  success: boolean
  recordsSynced: number
  errorMessage?: string
  timestamp: string
}

export interface AdapterConfig {
  type: 'mock' | 'sheets'
  sheetsUrl?: string
  apiToken?: string
  syncIntervalMs?: number
}
