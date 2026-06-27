import { Member, CreateMemberInput, UpdateMemberInput, SyncResult } from '@/types'

/**
 * The data source contract.
 * V1: implemented by SheetsAdapter (Google Apps Script)
 * V2: implemented by SupabaseAdapter
 * Dev: implemented by MockAdapter
 *
 * Components and services ONLY depend on this interface.
 * Swapping data sources requires changing only the adapter factory.
 */
export interface IDataAdapter {
  // ── Members ──────────────────────────────────────────────────────
  getMembers(): Promise<Member[]>
  getMemberById(id: string): Promise<Member | null>
  createMember(input: CreateMemberInput): Promise<Member>
  updateMember(id: string, input: UpdateMemberInput): Promise<Member>
  deleteMember(id: string): Promise<void>
  /** Pull new Google Form submissions into the Members list */
  syncMembersFromForms(): Promise<SyncResult>
}
