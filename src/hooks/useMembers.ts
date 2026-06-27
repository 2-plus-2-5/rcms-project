import { useEffect, useMemo, useCallback } from 'react'
import { useMembersStore } from '@/stores/members.store'
import { useSyncStore } from '@/stores/sync.store'
import { toast } from '@/stores/ui.store'
import * as memberService from '@/services/member.service'
import { getLastSyncTime } from '@/services/member.service'
import { computeMemberStats, getRecentMembers } from '@/services/dashboard.service'
import { Member, MemberFilters, MemberSort, CreateMemberInput, UpdateMemberInput } from '@/types'

function applyFiltersAndSort(
  members: Member[],
  filters: MemberFilters,
  sort: MemberSort
): Member[] {
  let result = [...members]
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.communityId.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q)
    )
  }
  if (filters.status !== 'all') {
    result = result.filter((m) => m.membershipStatus === filters.status)
  }
  if (filters.city !== 'all') {
    result = result.filter((m) => m.city === filters.city)
  }
  if (filters.interest !== 'all') {
    result = result.filter((m) => m.readingInterests.includes(filters.interest as never))
  }
  result.sort((a, b) => {
    const aVal = a[sort.field] as string
    const bVal = b[sort.field] as string
    const dir = sort.direction === 'asc' ? 1 : -1
    return aVal < bVal ? -dir : aVal > bVal ? dir : 0
  })
  return result
}

export function useMembers() {
  const {
    members, isLoading, error,
    filters, sort,
    setMembers, setLoading, setError,
    setFilters, setSort, resetFilters,
    addMember, updateMemberInStore, removeMember,
  } = useMembersStore()

  const { setSyncing, setSyncSuccess, setSyncError, setLastSyncedAt } = useSyncStore()

  useEffect(() => {
    const ts = getLastSyncTime()
    if (ts) setLastSyncedAt(ts)
  }, [setLastSyncedAt])

  const load = useCallback(async (force = false) => {
    setLoading(true)
    setError(null)
    try {
      const data = await memberService.fetchMembers(force)
      setMembers(data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load members.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [setMembers, setLoading, setError])

  useEffect(() => { load() }, [load])

  const syncFromForms = useCallback(async () => {
    setSyncing()
    try {
      const result = await memberService.syncMembersFromForms()
      setSyncSuccess(result.recordsSynced)
      if (result.recordsSynced > 0) {
        toast.success('Synced ' + result.recordsSynced + ' new member(s) from Google Forms.')
        await load(true)
      } else {
        toast.info('Sync complete — no new members from Forms.')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sync failed.'
      setSyncError(msg)
      toast.error(msg)
    }
  }, [setSyncing, setSyncSuccess, setSyncError, load])

  const create = useCallback(async (input: CreateMemberInput): Promise<Member | null> => {
    try {
      const member = await memberService.createMember(input)
      addMember(member)
      toast.success(member.fullName + ' added as ' + member.communityId + '.')
      return member
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add member.')
      return null
    }
  }, [addMember])

  const update = useCallback(async (id: string, input: UpdateMemberInput): Promise<Member | null> => {
    try {
      const member = await memberService.updateMember(id, input)
      updateMemberInStore(id, member)
      toast.success('Member updated.')
      return member
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update member.')
      return null
    }
  }, [updateMemberInStore])

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      await memberService.deleteMember(id)
      removeMember(id)
      toast.success('Member removed.')
      return true
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove member.')
      return false
    }
  }, [removeMember])

  const filteredMembers = useMemo(
    () => applyFiltersAndSort(members, filters, sort),
    [members, filters, sort]
  )
  const stats = useMemo(() => computeMemberStats(members), [members])
  const recentMembers = useMemo(() => getRecentMembers(members, 6), [members])
  const uniqueCities = useMemo(
    () => [...new Set(members.map((m) => m.city))].sort(),
    [members]
  )

  return {
    members, filteredMembers, stats, recentMembers, uniqueCities,
    isLoading, error,
    filters, sort, setFilters, setSort, resetFilters,
    load, syncFromForms, create, update, remove,
  }
}

export function useMember(id: string) {
  const { members, isLoading } = useMembersStore()
  const member = useMemo(() => members.find((m) => m.id === id), [members, id])
  return { member: member ?? null, isLoading }
}
