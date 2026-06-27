import { IDataAdapter } from './adapter.interface'
import { Member, CreateMemberInput, UpdateMemberInput, SyncResult } from '@/types'
import { AdapterConfig } from '@/types/sync.types'

interface SheetsMember {
  id: string
  communityId: string
  fullName: string
  email: string
  phone: string
  city: string
  dateJoined: string
  readingInterests: string   // pipe-separated in sheet: "Fiction|History"
  membershipStatus: string
  notes: string
  sourceFormResponseId: string
  createdAt: string
  updatedAt: string
}

interface SheetsResponse<T> {
  success: boolean
  data?: T
  error?: string
}

function parseMember(raw: SheetsMember): Member {
  return {
    ...raw,
    readingInterests: raw.readingInterests
      ? (raw.readingInterests.split('|').map((s) => s.trim()).filter(Boolean) as Member['readingInterests'])
      : [],
    membershipStatus: raw.membershipStatus as Member['membershipStatus'],
    notes: raw.notes ?? '',
  }
}

function serializeInterests(interests: string[]): string {
  return interests.join('|')
}

export class SheetsAdapter implements IDataAdapter {
  private baseUrl: string
  private token: string

  constructor(config: AdapterConfig) {
    if (!config.sheetsUrl) throw new Error('SheetsAdapter requires a sheetsUrl.')
    this.baseUrl = config.sheetsUrl
    this.token = config.apiToken ?? ''
  }

  private async get<T>(params: Record<string, string>): Promise<T> {
    const url = new URL(this.baseUrl)
    url.searchParams.set('token', this.token)
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const json: SheetsResponse<T> = await res.json()
    if (!json.success) throw new Error(json.error ?? 'Sheets API error')
    return json.data as T
  }

  private async post<T>(body: Record<string, unknown>): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, token: this.token }),
    })
    const json: SheetsResponse<T> = await res.json()
    if (!json.success) throw new Error(json.error ?? 'Sheets API error')
    return json.data as T
  }

  async getMembers(): Promise<Member[]> {
    const raw = await this.get<SheetsMember[]>({ resource: 'members' })
    return raw.map(parseMember)
  }

  async getMemberById(id: string): Promise<Member | null> {
    try {
      const raw = await this.get<SheetsMember>({ resource: 'members', id })
      return parseMember(raw)
    } catch {
      return null
    }
  }

  async createMember(input: CreateMemberInput): Promise<Member> {
    const raw = await this.post<SheetsMember>({
      resource: 'members',
      action: 'create',
      payload: {
        ...input,
        readingInterests: serializeInterests(input.readingInterests),
      },
    })
    return parseMember(raw)
  }

  async updateMember(id: string, input: UpdateMemberInput): Promise<Member> {
    const payload: Record<string, unknown> = { id, ...input }
    if (input.readingInterests) {
      payload.readingInterests = serializeInterests(input.readingInterests)
    }
    const raw = await this.post<SheetsMember>({
      resource: 'members',
      action: 'update',
      payload,
    })
    return parseMember(raw)
  }

  async deleteMember(id: string): Promise<void> {
    await this.post<void>({
      resource: 'members',
      action: 'delete',
      payload: { id },
    })
  }

  async syncMembersFromForms(): Promise<SyncResult> {
    return await this.post<SyncResult>({
      resource: 'members',
      action: 'syncFromForms',
      payload: {},
    })
  }
}
