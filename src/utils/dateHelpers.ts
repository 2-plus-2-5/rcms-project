import {
  format,
  formatDistanceToNow,
  isThisMonth,
  isThisWeek,
  parseISO,
  isValid,
  differenceInDays,
  isBefore,
} from 'date-fns'

/** Format ISO date string to "15 Jun 2025" */
export function formatDate(dateStr: string): string {
  try {
    const d = parseISO(dateStr)
    return isValid(d) ? format(d, 'd MMM yyyy') : '—'
  } catch {
    return '—'
  }
}

/** Format ISO datetime string to "15 Jun 2025, 10:30 AM" */
export function formatDateTime(dateStr: string): string {
  try {
    const d = parseISO(dateStr)
    return isValid(d) ? format(d, 'd MMM yyyy, h:mm a') : '—'
  } catch {
    return '—'
  }
}

/** Returns relative time: "3 minutes ago", "2 days ago" */
export function timeAgo(dateStr: string): string {
  try {
    const d = parseISO(dateStr)
    return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : '—'
  } catch {
    return '—'
  }
}

/** Check if an ISO date is within the current calendar month */
export function isJoinedThisMonth(dateStr: string): boolean {
  try {
    return isThisMonth(parseISO(dateStr))
  } catch {
    return false
  }
}

/** Check if an ISO date is within the current calendar week */
export function isJoinedThisWeek(dateStr: string): boolean {
  try {
    return isThisWeek(parseISO(dateStr))
  } catch {
    return false
  }
}

/** How many days overdue is a return date? Returns 0 if not overdue */
export function daysOverdue(expectedReturnDate: string): number {
  try {
    const due = parseISO(expectedReturnDate)
    const today = new Date()
    if (isBefore(today, due)) return 0
    return differenceInDays(today, due)
  } catch {
    return 0
  }
}

/** Today's date as ISO string "YYYY-MM-DD" */
export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

/** Current datetime as ISO string */
export function nowISO(): string {
  return new Date().toISOString()
}
