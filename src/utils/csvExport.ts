import { Member } from '@/types'
import { formatDate } from './dateHelpers'

/**
 * Converts member records to a CSV string and triggers a browser download.
 * @param members — the member array to export
 * @param filename — defaults to "rcms-members-YYYY-MM-DD.csv"
 */
export function exportMembersToCSV(members: Member[], filename?: string): void {
  const headers = [
    'Community ID',
    'Full Name',
    'Email',
    'Phone',
    'City',
    'Date Joined',
    'Reading Interests',
    'Status',
    'Notes',
  ]

  const rows = members.map((m) => [
    m.communityId,
    m.fullName,
    m.email,
    m.phone,
    m.city,
    formatDate(m.dateJoined),
    m.readingInterests.join('; '),
    m.membershipStatus,
    m.notes.replace(/"/g, '""'), // escape quotes
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const today = new Date().toISOString().split('T')[0]
  link.href = url
  link.download = filename ?? `rcms-members-${today}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
