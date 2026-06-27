import { useNavigate } from 'react-router-dom'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { useMembers } from '@/hooks/useMembers'
import { TopBar } from '@/components/layout/TopBar'
import { MemberForm } from '@/components/members/MemberForm'
import { CreateMemberInput } from '@/types'

export default function AddMemberPage() {
  const navigate = useNavigate()
  const { create } = useMembers()

  const handleSubmit = async (data: CreateMemberInput) => {
    const member = await create(data)
    if (member) navigate('/members/' + member.id)
  }

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Add Member" subtitle="Create a new community member record" />

      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-5">
          <button onClick={() => navigate('/members')}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Members
          </button>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-rcms-primary/10 border border-rcms-primary/20">
                <UserPlus className="h-5 w-5 text-rcms-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-100">New Member</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  A Community ID will be auto-generated. For bulk onboarding, use the Google Forms sync.
                </p>
              </div>
            </div>

            <MemberForm
              onSubmit={handleSubmit}
              onCancel={() => navigate('/members')}
              submitLabel="Add Member"
            />
          </div>

          {/* Tip */}
          <div className="flex gap-3 p-4 rounded-xl bg-rcms-info/5 border border-rcms-info/20">
            <div className="shrink-0 text-rcms-info mt-0.5">ℹ️</div>
            <div className="text-sm text-slate-400">
              <span className="font-medium text-slate-300">Tip:</span> For members who joined via Google Form, use the{' '}
              <strong className="text-slate-300">Sync Now</strong> button in Settings to automatically import them with a generated Community ID.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
