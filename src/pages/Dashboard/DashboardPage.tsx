import { useNavigate } from 'react-router-dom'
import { Users, UserCheck, UserPlus, RefreshCw, ArrowRight, BookOpen, MapPin, TrendingUp } from 'lucide-react'
import { useMembers } from '@/hooks/useMembers'
import { TopBar } from '@/components/layout/TopBar'
import { StatCard } from '@/components/stats/StatCard'
import { MemberStatusBadge } from '@/components/members/MemberStatusBadge'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatDate } from '@/utils/dateHelpers'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatFullDate(): string {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { members, stats, recentMembers, isLoading, syncFromForms } = useMembers()

  const topCities = Object.entries(stats.cities).sort(([, a], [, b]) => b - a).slice(0, 4)

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Dashboard" subtitle={formatFullDate()} onSync={syncFromForms}
        actions={
          <Button variant="primary" size="sm" icon={<UserPlus className="h-3.5 w-3.5" />} onClick={() => navigate('/members/new')}>
            Add Member
          </Button>
        }
      />

      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* Greeting banner */}
        <div className="card p-5 surface-gradient border-rcms-primary/20 glow-primary">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">{getGreeting()} 👋</h2>
              <p className="text-sm text-slate-400 mt-1">
                {isLoading ? 'Loading community data…'
                  : stats.total === 0 ? 'Welcome to RCMS. Add your first member to get started.'
                  : 'Your community has ' + stats.total + ' member' + (stats.total !== 1 ? 's' : '') + ' across ' + Object.keys(stats.cities).length + ' ' + (Object.keys(stats.cities).length !== 1 ? 'cities' : 'city') + '.'}
              </p>
            </div>
            <Button variant="secondary" size="sm" icon={<RefreshCw className="h-3.5 w-3.5" />} onClick={syncFromForms}>
              <span className="hidden sm:inline">Sync Forms</span>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading member stats…" />
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Members" value={stats.total} icon={Users}
                iconColor="text-rcms-primary" iconBg="bg-rcms-primary/10"
                sub={Object.keys(stats.cities).length + ' cities'}
                onClick={() => navigate('/members')} />
              <StatCard label="Active" value={stats.active} icon={UserCheck}
                iconColor="text-rcms-success" iconBg="bg-rcms-success/10"
                sub={stats.total > 0 ? Math.round((stats.active / stats.total) * 100) + '% of total' : undefined}
                onClick={() => navigate('/members?status=active')} />
              <StatCard label="New This Month" value={stats.newThisMonth} icon={UserPlus}
                iconColor="text-rcms-info" iconBg="bg-rcms-info/10"
                trend={stats.newThisWeek > 0 ? { value: stats.newThisWeek, label: stats.newThisWeek + ' this week' } : undefined} />
              <StatCard label="Pending" value={stats.pending} icon={TrendingUp}
                iconColor="text-rcms-warning" iconBg="bg-rcms-warning/10"
                sub="Awaiting activation" onClick={() => navigate('/members?status=pending')} />
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Recent members */}
              <div className="card lg:col-span-2">
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">Recent Members</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Latest to join the community</p>
                  </div>
                  <Button variant="ghost" size="sm" iconRight={<ArrowRight className="h-3.5 w-3.5" />} onClick={() => navigate('/members')}>
                    View all
                  </Button>
                </div>
                {recentMembers.length === 0 ? (
                  <div className="px-5 pb-5 text-sm text-slate-500">No members yet.</div>
                ) : (
                  <div className="divide-y divide-rcms-border/50">
                    {recentMembers.map((m) => (
                      <div key={m.id} onClick={() => navigate('/members/' + m.id)}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-rcms-raised/40 cursor-pointer transition-colors">
                        <div className="w-9 h-9 rounded-full bg-rcms-primary/15 border border-rcms-primary/25 flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold text-rcms-primary-light">{m.fullName.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-100 truncate">{m.fullName}</span>
                            <span className="font-mono text-xs text-slate-600 hidden sm:block">{m.communityId}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500">{m.city}</span>
                            <span className="text-slate-700">·</span>
                            <span className="text-xs text-slate-500">{formatDate(m.dateJoined)}</span>
                          </div>
                        </div>
                        <MemberStatusBadge status={m.membershipStatus} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-4">
                {stats.topInterests.length > 0 && (
                  <div className="card p-5 flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="h-4 w-4 text-rcms-primary" />
                      <h3 className="text-sm font-semibold text-slate-100">Top Interests</h3>
                    </div>
                    <div className="space-y-2.5">
                      {stats.topInterests.map(({ interest, count }, idx) => {
                        const max = stats.topInterests[0]?.count ?? 1
                        const pct = Math.round((count / max) * 100)
                        return (
                          <div key={interest}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-300">{interest}</span>
                              <span className="text-slate-500">{count}</span>
                            </div>
                            <div className="h-1.5 bg-rcms-raised rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-700"
                                style={{ width: pct + '%', background: idx === 0 ? '#6366F1' : idx === 1 ? '#818CF8' : '#4F46E5', opacity: 1 - idx * 0.15 }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {topCities.length > 0 && (
                  <div className="card p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-4 w-4 text-rcms-info" />
                      <h3 className="text-sm font-semibold text-slate-100">Cities</h3>
                    </div>
                    <div className="space-y-2">
                      {topCities.map(([city, count]) => (
                        <div key={city} className="flex justify-between items-center">
                          <span className="text-sm text-slate-300">{city}</span>
                          <span className="text-xs font-medium text-slate-400 tabular-nums">{count} {count === 1 ? 'member' : 'members'}</span>
                        </div>
                      ))}
                      {Object.keys(stats.cities).length > 4 && (
                        <p className="text-xs text-slate-600 pt-1">+{Object.keys(stats.cities).length - 4} more cities</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status breakdown */}
            {members.length > 0 && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-slate-100 mb-4">Membership Status Breakdown</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {([['Active', stats.active, 'bg-rcms-success', 'text-rcms-success'],
                     ['Inactive', stats.inactive, 'bg-rcms-danger', 'text-rcms-danger'],
                     ['Paused', stats.paused, 'bg-rcms-warning', 'text-rcms-warning'],
                     ['Pending', stats.pending, 'bg-rcms-info', 'text-rcms-info']] as const
                  ).map(([label, count, dot, text]) => (
                    <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-rcms-raised/50">
                      <div className={['w-2.5 h-2.5 rounded-full shrink-0', dot].join(' ')} />
                      <div>
                        <div className={['text-xl font-bold', text].join(' ')}>{count}</div>
                        <div className="text-xs text-slate-500">{label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {stats.total > 0 && (
                  <div className="mt-4 h-2 rounded-full overflow-hidden flex gap-px">
                    {stats.active   > 0 && <div className="bg-rcms-success"  style={{ width: (stats.active   / stats.total * 100) + '%' }} />}
                    {stats.paused   > 0 && <div className="bg-rcms-warning"  style={{ width: (stats.paused   / stats.total * 100) + '%' }} />}
                    {stats.pending  > 0 && <div className="bg-rcms-info"     style={{ width: (stats.pending  / stats.total * 100) + '%' }} />}
                    {stats.inactive > 0 && <div className="bg-rcms-danger"   style={{ width: (stats.inactive / stats.total * 100) + '%' }} />}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
