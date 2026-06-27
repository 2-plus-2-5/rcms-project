/** Basic email format check */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/** Indian mobile number: 10 digits, optionally with +91 or 0 prefix */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-\+]/g, '')
  if (digits.startsWith('91')) return digits.slice(2).length === 10
  if (digits.startsWith('0'))  return digits.slice(1).length === 10
  return digits.length === 10
}

/** Non-empty string check */
export function isRequired(value: string): boolean {
  return value.trim().length > 0
}

/** Validates Google Apps Script web app URL format */
export function isValidAppsScriptUrl(url: string): boolean {
  return url.startsWith('https://script.google.com/macros/s/')
}

export interface ValidationError {
  field: string
  message: string
}

export interface MemberFormValues {
  fullName: string
  email: string
  phone: string
  city: string
  dateJoined: string
  readingInterests: string[]
  membershipStatus: string
  notes: string
}

export function validateMemberForm(values: MemberFormValues): ValidationError[] {
  const errors: ValidationError[] = []
  if (!isRequired(values.fullName))
    errors.push({ field: 'fullName', message: 'Full name is required.' })
  if (!isRequired(values.email))
    errors.push({ field: 'email', message: 'Email is required.' })
  else if (!isValidEmail(values.email))
    errors.push({ field: 'email', message: 'Enter a valid email address.' })
  if (!isRequired(values.phone))
    errors.push({ field: 'phone', message: 'Phone number is required.' })
  if (!isRequired(values.city))
    errors.push({ field: 'city', message: 'City is required.' })
  if (!isRequired(values.dateJoined))
    errors.push({ field: 'dateJoined', message: 'Date joined is required.' })
  return errors
}
