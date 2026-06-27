import { useNavigate } from 'react-router-dom'
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react'
import { Member, MemberSortField, MemberSort } from '@/types'
import { MemberStatusBadge } from './MemberStatusBadge'
import { formatDate } from '@/utils/dateHelpers'

interface MemberTableProps {
  members: Member[]
  sort: MemberSort
  onSort: (field: MemberSortField) => void
  isLoading?: boolean
}

function SortIcon({ field, sort }: { field: MemberSortField; sort: MemberSort }) {
  if (sort.field !== field) return <ArrowUpDown className="h-3 w-3 text-slate-600" />
  return sort.direction === 'asc'
    ? <ChevronUp className="h-3 w-3 text-rcms-primary" />
    : <ChevronDown className="h-3 w-3 text-rcms-primary" />
}

const COLS: { key: MemberSortField; label: string; sortable?: boolean }[] = [
  { key: 'communityId', label: 'ID',          sortable: true },
  { key: 'fullName',    label: 'Name',        sortable: true },
  { key: 'city',        label: 'City',        sortable: true },
  { key: 'dateJoined',  label: 'Joined',      sortable: true },
  { key: 'membershipStatus', label: 'Status', sortable: true },
]

function SkeletonRow() {
  return (
    <tr>
      {COLS.map((c) => (
        <td key={c.key} className="px-4 py-3.5 border-b border-rcms-border/50">
          <div className="h-3.5 bg-rcms-raised rounded animate-pulse" style={{ width: c.key === 'fullName' ? '70%' : c.key === 'membershipStatus' ? '50%' : '60%' }} />
        </td>
      ))}
      <td className="px-4 py-3.5 border-b border-rcms-border/50">
        <div className="h-3.5 bg-rcms-raised rounded animate-pulse w-4/5" />
      </td>
    </tr>
  )
}

export function MemberTable({ members, sort, onSort, isLoading }: MemberTableProps) {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {COLS.map((col) => (
              <th key={col.key}>
                {col.sortable ? (
                  <button
                    onClick={() => onSort(col.key)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
                  >
                    {col.label}
                    <SortIcon field={col.key} sort={sort} />
                  </button>
                ) : col.label}
              </th>
            ))}
            <th>Interests</th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            : members.map((m) => (
                <tr key={m.id} onClick={() => navigate('/members/' + m.id)}>
                  <td>
                    <span className="font-mono text-xs text-rcms-primary-light">{m.communityId}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-rcms-primary/20 border border-rcms-primary/30 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-rcms-primary-light">
                          {m.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-100 leading-snug">{m.fullName}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[180px]">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-slate-400">{m.city}</td>
                  <td className="text-slate-400 whitespace-nowrap">{formatDate(m.dateJoined)}</td>
                  <td><MemberStatusBadge status={m.membershipStatus} /></td>
                  <td>
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {m.readingInterests.slice(0, 2).map((i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-rcms-raised border border-rcms-border text-slate-400">
                          {i}
                        </span>
                      ))}
                      {m.readingInterests.length > 2 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-rcms-raised border border-rcms-border text-slate-500">
                          +{m.readingInterests.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  )
}
