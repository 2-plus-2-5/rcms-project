// ─── Member Entity ───────────────────────────────────────────────────

export type MembershipStatus = 'active' | 'inactive' | 'paused' | 'pending'

export type ReadingInterest =
  | 'Fiction'
  | 'Non-Fiction'
  | 'Biography'
  | 'History'
  | 'Science'
  | 'Philosophy'
  | 'Self-Help'
  | 'Poetry'
  | 'Mystery'
  | 'Fantasy'
  | 'Children'
  | 'Regional Language'
  | 'Other'

export interface Member {
  /** Internal UUID — used for all DB references and routing */
  id: string
  /** Human-readable display ID, e.g. "RC-001" */
  communityId: string
  fullName: string
  email: string
  phone: string
  city: string
  /** ISO 8601 date string, e.g. "2025-06-15" */
  dateJoined: string
  readingInterests: ReadingInterest[]
  membershipStatus: MembershipStatus
  /** Free-text notes visible only to organizers */
  notes: string
  /** Google Form submission row ID — used for deduplication on sync */
  sourceFormResponseId: string
  /** ISO 8601 datetime */
  createdAt: string
  /** ISO 8601 datetime */
  updatedAt: string
}

// ─── Form / Input Types ──────────────────────────────────────────────

export type CreateMemberInput = Omit<
  Member,
  'id' | 'communityId' | 'sourceFormResponseId' | 'createdAt' | 'updatedAt'
>

export type UpdateMemberInput = Partial<
  Pick<Member, 'fullName' | 'email' | 'phone' | 'city' | 'readingInterests' | 'membershipStatus' | 'notes'>
>

// ─── Filter / Search Types ───────────────────────────────────────────

export interface MemberFilters {
  search: string
  status: MembershipStatus | 'all'
  city: string | 'all'
  interest: ReadingInterest | 'all'
}

export type MemberSortField = 'fullName' | 'dateJoined' | 'communityId' | 'city' | 'membershipStatus'
export type SortDirection = 'asc' | 'desc'

export interface MemberSort {
  field: MemberSortField
  direction: SortDirection
}

// ─── Derived / Computed ──────────────────────────────────────────────

export interface MemberStats {
  total: number
  active: number
  inactive: number
  paused: number
  pending: number
  newThisMonth: number
  newThisWeek: number
  cities: Record<string, number>
  topInterests: Array<{ interest: string; count: number }>
}
