import { Member, MemberStats } from '@/types'
import { isJoinedThisMonth, isJoinedThisWeek } from '@/utils/dateHelpers'

/** Computes all dashboard statistics from the raw member array. Pure function — no side effects. */
export function computeMemberStats(members: Member[]): MemberStats {
  const cities: Record<string, number> = {}
  const interestCounts: Record<string, number> = {}

  for (const m of members) {
    // City aggregation
    cities[m.city] = (cities[m.city] ?? 0) + 1
    // Interest aggregation
    for (const interest of m.readingInterests) {
      interestCounts[interest] = (interestCounts[interest] ?? 0) + 1
    }
  }

  const topInterests = Object.entries(interestCounts)
    .map(([interest, count]) => ({ interest, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return {
    total: members.length,
    active: members.filter((m) => m.membershipStatus === 'active').length,
    inactive: members.filter((m) => m.membershipStatus === 'inactive').length,
    paused: members.filter((m) => m.membershipStatus === 'paused').length,
    pending: members.filter((m) => m.membershipStatus === 'pending').length,
    newThisMonth: members.filter((m) => isJoinedThisMonth(m.dateJoined)).length,
    newThisWeek: members.filter((m) => isJoinedThisWeek(m.dateJoined)).length,
    cities,
    topInterests,
  }
}

/** Returns the N most recently joined members */
export function getRecentMembers(members: Member[], limit = 6): Member[] {
  return [...members]
    .sort((a, b) => new Date(b.dateJoined).getTime() - new Date(a.dateJoined).getTime())
    .slice(0, limit)
}
