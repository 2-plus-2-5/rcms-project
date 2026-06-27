import { useNavigate } from 'react-router-dom'
import { BookOpen, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-rcms-bg flex items-center justify-center p-6">
      <div className="text-center space-y-5 max-w-sm">
        <div className="flex justify-center">
          <div className="p-5 rounded-2xl bg-rcms-surface border border-rcms-border">
            <BookOpen className="h-10 w-10 text-slate-600" />
          </div>
        </div>
        <div>
          <h1 className="text-5xl font-bold text-slate-700 mb-3">404</h1>
          <h2 className="text-lg font-semibold text-slate-300">Page not found</h2>
          <p className="text-sm text-slate-500 mt-2">The page you're looking for doesn't exist in this chapter.</p>
        </div>
        <Button variant="primary" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}
