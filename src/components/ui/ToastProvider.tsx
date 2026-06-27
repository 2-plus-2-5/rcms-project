import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useUIStore, Toast, ToastType } from '@/stores/ui.store'

const TOAST_ICONS: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}
const TOAST_STYLES: Record<ToastType, string> = {
  success: 'border-rcms-success/30 bg-rcms-success/5',
  error:   'border-rcms-danger/30  bg-rcms-danger/5',
  warning: 'border-rcms-warning/30 bg-rcms-warning/5',
  info:    'border-rcms-info/30    bg-rcms-info/5',
}
const TOAST_ICON_COLORS: Record<ToastType, string> = {
  success: 'text-rcms-success', error: 'text-rcms-danger',
  warning: 'text-rcms-warning', info: 'text-rcms-info',
}

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useUIStore()
  const Icon = TOAST_ICONS[toast.type]
  return (
    <div className={['toast-enter flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm max-w-sm w-full shadow-xl', TOAST_STYLES[toast.type]].join(' ')} role="alert">
      <Icon className={['h-4 w-4 mt-0.5 shrink-0', TOAST_ICON_COLORS[toast.type]].join(' ')} />
      <p className="text-sm text-slate-200 flex-1 leading-snug">{toast.message}</p>
      <button onClick={() => removeToast(toast.id)} className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors mt-0.5">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function ToastProvider() {
  const { toasts } = useUIStore()
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  )
}
