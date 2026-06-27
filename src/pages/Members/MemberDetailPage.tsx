import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar,
  BookOpen, Edit2, Save, X, Trash2, ExternalLink,
} from 'lucide-react'
import { useMember, useMembers } from '@/hooks/useMembers'
import { TopBar } from '@/components/layout/TopBar'
import { MemberStatusBadge } from '@/components/members/MemberStatusBadge'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Badge } from '@/components/ui/Badge'
import { MembershipStatus } from '@/types'
import { formatDate, formatDateTime } from '@/utils/dateHelpers'

const STATUS_OPTS: { value: MembershipStatus; label: string }[] = [
  { value: 'active',   label: 'Active'   },
  { value: 'inactive', label: 'Inactive' },
  { value: 'paused',   label: 'Paused'   },
  { value: 'pending',  label: 'Pending'  },
]

function InfoRow({ icon: Icon, label, value, href }: { icon: React.ElementType; label: string; value: string; href?: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-rcms-border/50 last:border-b-0">
      <div className="p-1.5 rounded-md bg-rcms-raised mt-0.5 shrink-0">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        {href ? (
          <a href={href} className="text-sm text-rcms-primary-light hover:underline flex items-center gap-1">
            {value} <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <p className="text-sm text-slate-200 break-all">{value || '—'}</p>
        )}
      </div>
    </div>
  )
}

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { member, isLoading } = useMember(id ?? '')
  const { update, remove } = useMembers()

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const [editStatus, setEditStatus] = useState<MembershipStatus>('active')
  const [editNotes, setEditNotes] = useState('')

  const startEdit = () => {
    if (!member) return
    setEditStatus(member.membershipStatus)
    setEditNotes(member.notes)
    setEditing(true)
  }

  const cancelEdit = () => setEditing(false)

  const handleSave = async () => {
    if (!member) return
    setSaving(true)
    await update(member.id, { membershipStatus: editStatus, notes: editNotes })
    setSaving(false)
    setEditing(false)
  }

  const handleDelete = async () => {
    if (!member) return
    setDeleting(true)
    const ok = await remove(member.id)
    if (ok) navigate('/members')
    else setDeleting(false)
  }

  if (isLoading) return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Member Detail" />
      <LoadingSpinner message="Loading member…" />
    </div>
  )

  if (!member) return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Member not found" />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-slate-400">This member could not be found.</p>
        <Button variant="secondary" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/members')}>
          Back to Members
        </Button>
      </div>
    </div>
  )

  const initials = member.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="flex flex-col min-h-full">
      <TopBar
        title={member.fullName}
        subtitle={member.communityId}
        actions={
          <div className="flex items-center gap-2">
            {!editing ? (
              <>
                <Button variant="secondary" size="sm" icon={<Edit2 className="h-3.5 w-3.5" />} onClick={startEdit}>
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button variant="danger" size="sm" icon={<Trash2 className="h-3.5 w-3.5" />}
                  onClick={() => setConfirmDelete(true)}>
                  <span className="hidden sm:inline">Remove</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="primary" size="sm" icon={<Save className="h-3.5 w-3.5" />}
                  onClick={handleSave} loading={saving}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" icon={<X className="h-3.5 w-3.5" />}
                  onClick={cancelEdit} disabled={saving}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Back link */}
          <button onClick={() => navigate('/members')}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Members
          </button>

          {/* Profile header card */}
          <div className="card p-6 surface-gradient">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-rcms-primary/20 border-2 border-rcms-primary/30 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-rcms-primary-light">{initials}</span>
              </div>

              {/* Name / meta */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-slate-100">{member.fullName}</h2>
                  <MemberStatusBadge status={member.membershipStatus} />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="font-mono text-rcms-primary-light">{member.communityId}</span>
                  <span>·</span>
                  <span>Joined {formatDate(member.dateJoined)}</span>
                </div>
              </div>

              {/* Edit status (inline when editing) */}
              {editing && (
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as MembershipStatus)}
                  className="input-base text-sm shrink-0">
                  {STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact info */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-100 mb-3">Contact Information</h3>
              <InfoRow icon={Mail} label="Email" value={member.email} href={'mailto:' + member.email} />
              <InfoRow icon={Phone} label="Phone" value={member.phone} href={'tel:' + member.phone} />
              <InfoRow icon={MapPin} label="City" value={member.city} />
              <InfoRow icon={Calendar} label="Date Joined" value={formatDate(member.dateJoined)} />
            </div>

            {/* Reading interests */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-rcms-primary" />
                <h3 className="text-sm font-semibold text-slate-100">Reading Interests</h3>
              </div>
              {member.readingInterests.length === 0 ? (
                <p className="text-sm text-slate-500">No interests recorded.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {member.readingInterests.map((interest) => (
                    <Badge key={interest} variant="primary">{interest}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Organizer notes */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-100 mb-3">Organizer Notes</h3>
            {editing ? (
              <textarea rows={4} value={editNotes} onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Internal notes — not visible to members…"
                className="input-base w-full resize-none" />
            ) : (
              <p className={['text-sm leading-relaxed', member.notes ? 'text-slate-300' : 'text-slate-600 italic'].join(' ')}>
                {member.notes || 'No notes yet. Click Edit to add organizer notes.'}
              </p>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-600 px-1">
            <span>Created: {formatDateTime(member.createdAt)}</span>
            <span>·</span>
            <span>Last updated: {formatDateTime(member.updatedAt)}</span>
            <span>·</span>
            <span>Source: {member.sourceFormResponseId.startsWith('manual') ? 'Added manually' : 'Google Form'}</span>
          </div>
        </div>
      </div>

      {/* Delete confirmation overlay */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card p-6 max-w-sm w-full space-y-4 animate-fade-in">
            <div className="p-3 rounded-xl bg-rcms-danger/10 border border-rcms-danger/20 w-fit">
              <Trash2 className="h-5 w-5 text-rcms-danger" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Remove {member.fullName}?</h3>
              <p className="text-sm text-slate-400 mt-1">
                This will permanently remove {member.communityId} from the community. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="danger" onClick={handleDelete} loading={deleting} className="flex-1">
                Yes, remove member
              </Button>
              <Button variant="secondary" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
