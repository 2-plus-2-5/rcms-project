/** localStorage key where adapter settings are persisted */
export const STORAGE_KEY_CONFIG    = 'rcms_adapter_config'
/** localStorage key for cached member data */
export const STORAGE_KEY_MEMBERS   = 'rcms_members_cache'
/** localStorage key for sync metadata */
export const STORAGE_KEY_SYNC_META = 'rcms_sync_meta'

/** How long (ms) before cached data is considered stale and re-fetched */
export const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

/** Community ID prefix — all member IDs are "RC-001", "RC-002", etc. */
export const COMMUNITY_ID_PREFIX = 'RC'

/** Default expected borrow period in days (for future use) */
export const DEFAULT_BORROW_DAYS = 14

export const READING_INTERESTS = [
  'Fiction',
  'Non-Fiction',
  'Biography',
  'History',
  'Science',
  'Philosophy',
  'Self-Help',
  'Poetry',
  'Mystery',
  'Fantasy',
  'Children',
  'Regional Language',
  'Other',
] as const

export const MEMBERSHIP_STATUS_LABELS: Record<string, string> = {
  active:   'Active',
  inactive: 'Inactive',
  paused:   'Paused',
  pending:  'Pending',
}

export const MEMBERSHIP_STATUS_COLORS: Record<string, string> = {
  active:   'success',
  inactive: 'danger',
  paused:   'warning',
  pending:  'info',
}
