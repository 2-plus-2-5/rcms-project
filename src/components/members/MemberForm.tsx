import { useState } from 'react'
import { Member, CreateMemberInput, MembershipStatus, ReadingInterest } from '@/types'
import { READING_INTERESTS } from '@/constants/config'
import { Button } from '@/components/ui/Button'
import { todayISO } from '@/utils/dateHelpers'
import { validateMemberForm, ValidationError } from '@/utils/validators'

interface MemberFormProps {
  initial?: Partial<Member>
  onSubmit: (data: CreateMemberInput) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

const STATUS_OPTIONS: { value: MembershipStatus; label: string }[] = [
  { value: 'active',   label: 'Active'   },
  { value: 'inactive', label: 'Inactive' },
  { value: 'paused',   label: 'Paused'   },
  { value: 'pending',  label: 'Pending'  },
]

type FieldErrors = Record<string, string>

function toFieldErrors(errs: ValidationError[]): FieldErrors {
  return Object.fromEntries(errs.map((e) => [e.field, e.message]))
}

interface FieldProps { label: string; error?: string; required?: boolean; children: React.ReactNode }
function Field({ label, error, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400">
        {label}{required && <span className="text-rcms-danger ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-rcms-danger">{error}</p>}
    </div>
  )
}

export function MemberForm({ initial, onSubmit, onCancel, submitLabel = 'Add Member' }: MemberFormProps) {
  const [values, setValues] = useState({
    fullName:         initial?.fullName         ?? '',
    email:            initial?.email            ?? '',
    phone:            initial?.phone            ?? '',
    city:             initial?.city             ?? '',
    dateJoined:       initial?.dateJoined       ?? todayISO(),
    readingInterests: initial?.readingInterests ?? [] as ReadingInterest[],
    membershipStatus: initial?.membershipStatus ?? ('active' as MembershipStatus),
    notes:            initial?.notes            ?? '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  const set = <K extends keyof typeof values>(key: K, val: (typeof values)[K]) =>
    setValues((v) => ({ ...v, [key]: val }))

  const toggleInterest = (interest: ReadingInterest) => {
    set('readingInterests',
      values.readingInterests.includes(interest)
        ? values.readingInterests.filter((i) => i !== interest)
        : [...values.readingInterests, interest]
    )
  }

  const handleSubmit = async () => {
    const errs = validateMemberForm({ ...values, readingInterests: values.readingInterests })
    if (errs.length) { setErrors(toFieldErrors(errs)); return }
    setErrors({})
    setLoading(true)
    try { await onSubmit(values) }
    finally { setLoading(false) }
  }

  const inputCls = (field: string) =>
    ['input-base w-full', errors[field] ? 'border-rcms-danger/50 focus:ring-rcms-danger' : ''].join(' ')

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" error={errors.fullName} required>
          <input className={inputCls('fullName')} value={values.fullName}
            onChange={(e) => set('fullName', e.target.value)} placeholder="Aryan Deshmukh" />
        </Field>
        <Field label="Email Address" error={errors.email} required>
          <input type="email" className={inputCls('email')} value={values.email}
            onChange={(e) => set('email', e.target.value)} placeholder="aryan@gmail.com" />
        </Field>
        <Field label="Phone Number" error={errors.phone} required>
          <input type="tel" className={inputCls('phone')} value={values.phone}
            onChange={(e) => set('phone', e.target.value)} placeholder="+91 94201 12345" />
        </Field>
        <Field label="City" error={errors.city} required>
          <input className={inputCls('city')} value={values.city}
            onChange={(e) => set('city', e.target.value)} placeholder="Amravati" />
        </Field>
        <Field label="Date Joined" error={errors.dateJoined} required>
          <input type="date" className={inputCls('dateJoined')} value={values.dateJoined}
            onChange={(e) => set('dateJoined', e.target.value)} />
        </Field>
        <Field label="Membership Status">
          <select className="input-base w-full" value={values.membershipStatus}
            onChange={(e) => set('membershipStatus', e.target.value as MembershipStatus)}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Reading Interests">
        <div className="flex flex-wrap gap-2 pt-1">
          {READING_INTERESTS.map((interest) => {
            const active = values.readingInterests.includes(interest as ReadingInterest)
            return (
              <button key={interest} type="button" onClick={() => toggleInterest(interest as ReadingInterest)}
                className={['text-xs px-3 py-1.5 rounded-full border transition-all duration-150 font-medium',
                  active ? 'bg-rcms-primary/20 border-rcms-primary/50 text-rcms-primary-light'
                           : 'bg-rcms-raised border-rcms-border text-slate-400 hover:border-slate-500 hover:text-slate-300'
                ].join(' ')}>
                {interest}
              </button>
            )
          })}
        </div>
      </Field>

      <Field label="Organizer Notes">
        <textarea rows={3} className="input-base w-full resize-none" value={values.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Internal notes — not visible to members." />
      </Field>

      <div className="flex items-center gap-3 pt-1">
        <Button variant="primary" onClick={handleSubmit} loading={loading} className="flex-1 sm:flex-none">
          {submitLabel}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
      </div>
    </div>
  )
}
