import { Badge } from '@/components/ui/Badge'
import { MembershipStatus } from '@/types'

const STATUS_CONFIG: Record<MembershipStatus, { variant: 'success' | 'danger' | 'warning' | 'info'; label: string }> = {
  active:   { variant: 'success', label: 'Active' },
  inactive: { variant: 'danger',  label: 'Inactive' },
  paused:   { variant: 'warning', label: 'Paused' },
  pending:  { variant: 'info',    label: 'Pending' },
}

export function MemberStatusBadge({ status }: { status: MembershipStatus }) {
  const { variant, label } = STATUS_CONFIG[status] ?? { variant: 'neutral' as const, label: status }
  return <Badge variant={variant} dot>{label}</Badge>
}
