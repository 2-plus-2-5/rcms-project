import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UserPlus, Download, Users, Filter, X } from 'lucide-react'
import { useMembers } from '@/hooks/useMembers'
import { TopBar } from '@/components/layout/TopBar'
import { MemberTable } from '@/components/members/MemberTable'
import { SearchInput } from '@/components/ui/SearchInput'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { MembershipStatus, MemberSortField, ReadingInterest } from '@/types'
import { exportMembersToCSV } from '@/utils/csvExport'
import { READING_INTERESTS } from '@/constants/config'

const STATUS_OPTS = [
  { value: 'all',      label: 'All Statuses' },
  { value: 'active',   label: 'Active'        },
  { value: 'inactive', label: 'Inactive'      },
  { value: 'paused',   label: 'Paused'        },
  { value: 'pending',  label: 'Pending'       },
]

export default function MembersPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const {
    members, filteredMembers, isLoading, stats,
    filters, sort, setFilters, setSort,
    uniqueCities, syncFromForms, resetFilters,
  } = useMembers()

  // Support ?status= URL param from Dashboard clicks
  useEffect(() => {
    const status = searchParams.get('status')
    if (status) setFilters({ status: status as MembershipStatus | 'all' })
  }, [searchParams, setFilters])

  const handleSort = (field: MemberSortField) => {
    setSort({
      field,
      direction: sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc',
    })
  }

  const hasActiveFilters =
    filters.search !== '' || filters.status !== 'all' ||
    filters.city !== 'all' || filters.interest !== 'all'

  const selectCls = 'input-base text-sm'

  return (
    <div className="flex flex-col min-h-full">
      <TopBar
        title="Members"
        subtitle={stats.total + ' total · ' + stats.active + ' active'}
        onSync={syncFromForms}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download className="h-3.5 w-3.5" />}
              onClick={() => exportMembersToCSV(filteredMembers)} disabled={filteredMembers.length === 0}>
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="primary" size="sm" icon={<UserPlus className="h-3.5 w-3.5" />}
              onClick={() => navigate('/members/new')}>
              <span className="hidden sm:inline">Add Member</span>
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-4 md:p-6 space-y-4">
        {/* Filter bar */}
        <div className="card p-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <SearchInput value={filters.search} onChange={(v) => setFilters({ search: v })}
              placeholder="Search name, email, phone, city, ID…" className="flex-1" />
            <div className="flex gap-2 flex-wrap">
              <select value={filters.status} onChange={(e) => setFilters({ status: e.target.value as MembershipStatus | 'all' })} className={selectCls}>
                {STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select value={filters.city} onChange={(e) => setFilters({ city: e.target.value })} className={selectCls}>
                <option value="all">All Cities</option>
                {uniqueCities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filters.interest} onChange={(e) => setFilters({ interest: e.target.value as ReadingInterest | 'all' })} className={selectCls}>
                <option value="all">All Interests</option>
                {READING_INTERESTS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" icon={<X className="h-3.5 w-3.5" />} onClick={resetFilters}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-rcms-border">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Filter className="h-3 w-3" />Filtering:
              </span>
              {filters.search && (
                <span className="flex items-center gap-1 text-xs bg-rcms-primary/10 border border-rcms-primary/20 text-rcms-primary-light px-2 py-0.5 rounded-full">
                  "{filters.search}"
                  <button onClick={() => setFilters({ search: '' })} className="hover:text-white"><X className="h-2.5 w-2.5" /></button>
                </span>
              )}
              {filters.status !== 'all' && (
                <span className="flex items-center gap-1 text-xs bg-rcms-raised border border-rcms-border text-slate-300 px-2 py-0.5 rounded-full">
                  {filters.status}
                  <button onClick={() => setFilters({ status: 'all' })} className="hover:text-white"><X className="h-2.5 w-2.5" /></button>
                </span>
              )}
              {filters.city !== 'all' && (
                <span className="flex items-center gap-1 text-xs bg-rcms-raised border border-rcms-border text-slate-300 px-2 py-0.5 rounded-full">
                  {filters.city}
                  <button onClick={() => setFilters({ city: 'all' })} className="hover:text-white"><X className="h-2.5 w-2.5" /></button>
                </span>
              )}
              {filters.interest !== 'all' && (
                <span className="flex items-center gap-1 text-xs bg-rcms-raised border border-rcms-border text-slate-300 px-2 py-0.5 rounded-full">
                  {filters.interest}
                  <button onClick={() => setFilters({ interest: 'all' })} className="hover:text-white"><X className="h-2.5 w-2.5" /></button>
                </span>
              )}
              <span className="text-xs text-slate-500 ml-1">{filteredMembers.length} of {members.length} shown</span>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {!isLoading && filteredMembers.length === 0 ? (
            hasActiveFilters ? (
              <EmptyState icon={Filter} title="No members match your filters"
                description="Try adjusting or clearing the search and filter options."
                action={{ label: 'Clear all filters', onClick: resetFilters }} />
            ) : (
              <EmptyState icon={Users} title="No members yet"
                description="Add your first member manually or sync from Google Forms."
                action={{ label: 'Add Member', onClick: () => navigate('/members/new') }} />
            )
          ) : (
            <>
              <MemberTable members={filteredMembers} sort={sort} onSort={handleSort} isLoading={isLoading} />
              {!isLoading && filteredMembers.length > 0 && (
                <div className="px-4 py-3 border-t border-rcms-border bg-rcms-surface flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Showing {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
                    {hasActiveFilters && ' (filtered from ' + members.length + ')'}
                  </p>
                  <Button variant="ghost" size="sm" icon={<Download className="h-3.5 w-3.5" />}
                    onClick={() => exportMembersToCSV(filteredMembers)}>
                    Export CSV
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
