import { create } from 'zustand'
import { Member, MemberFilters, MemberSort } from '@/types'

interface MembersState {
  members: Member[]
  isLoading: boolean
  error: string | null

  // ── Filter / sort state (for the Members page) ────────────────
  filters: MemberFilters
  sort: MemberSort

  // ── Actions ───────────────────────────────────────────────────
  setMembers: (members: Member[]) => void
  addMember: (member: Member) => void
  updateMemberInStore: (id: string, member: Member) => void
  removeMember: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setFilters: (filters: Partial<MemberFilters>) => void
  setSort: (sort: Partial<MemberSort>) => void
  resetFilters: () => void
}

const DEFAULT_FILTERS: MemberFilters = {
  search: '',
  status: 'all',
  city: 'all',
  interest: 'all',
}

const DEFAULT_SORT: MemberSort = {
  field: 'dateJoined',
  direction: 'desc',
}

export const useMembersStore = create<MembersState>((set) => ({
  members: [],
  isLoading: false,
  error: null,
  filters: DEFAULT_FILTERS,
  sort: DEFAULT_SORT,

  setMembers: (members) => set({ members }),
  addMember: (member) => set((s) => ({ members: [...s.members, member] })),
  updateMemberInStore: (id, updated) =>
    set((s) => ({ members: s.members.map((m) => (m.id === id ? updated : m)) })),
  removeMember: (id) =>
    set((s) => ({ members: s.members.filter((m) => m.id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (partial) =>
    set((s) => ({ filters: { ...s.filters, ...partial } })),
  setSort: (partial) =>
    set((s) => ({ sort: { ...s.sort, ...partial } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS, sort: DEFAULT_SORT }),
}))
