import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  trend?: { value: number; label: string }
  sub?: string
  onClick?: () => void
}

export function StatCard({ label, value, icon: Icon, iconColor = 'text-rcms-primary', iconBg = 'bg-rcms-primary/10', trend, sub, onClick }: StatCardProps) {
  const isPositiveTrend = trend && trend.value >= 0
  return (
    <div
      onClick={onClick}
      className={['card p-5 flex flex-col gap-4 surface-gradient', onClick ? 'cursor-pointer hover:border-rcms-primary/40 transition-colors' : ''].join(' ')}
    >
      <div className="flex items-start justify-between">
        <div className={['p-2.5 rounded-lg', iconBg].join(' ')}>
          <Icon className={['h-5 w-5', iconColor].join(' ')} />
        </div>
        {trend && (
          <div className={['flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full', isPositiveTrend ? 'text-rcms-success bg-rcms-success/10' : 'text-rcms-danger bg-rcms-danger/10'].join(' ')}>
            {isPositiveTrend ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend.value)}
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-100 tracking-tight">{value}</div>
        <div className="text-sm text-slate-400 mt-0.5">{label}</div>
        {trend && <div className="text-xs text-slate-500 mt-1">{trend.label}</div>}
        {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
      </div>
    </div>
  )
}
