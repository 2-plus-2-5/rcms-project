import { getAdapter } from '@/adapters/adapter.factory'
import { Member, CreateMemberInput, UpdateMemberInput, SyncResult } from '@/types'
import { STORAGE_KEY_MEMBERS, STORAGE_KEY_SYNC_META, CACHE_TTL_MS } from '@/constants/config'

interface CacheMeta {
  cachedAt: string
}

// ─── Cache helpers ───────────────────────────────────────────────────
function getCachedMembers(): Member[] | null {
  try {
    const metaRaw = localStorage.getItem(STORAGE_KEY_SYNC_META)
    const dataRaw = localStorage.getItem(STORAGE_KEY_MEMBERS)
    if (!metaRaw || !dataRaw) return null

    const meta: CacheMeta = JSON.parse(metaRaw)
    const age = Date.now() - new Date(meta.cachedAt).getTime()
    if (age > CACHE_TTL_MS) return null // stale

    return JSON.parse(dataRaw) as Member[]
  } catch {
    return null
  }
}

function setCachedMembers(members: Member[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members))
    localStorage.setItem(
      STORAGE_KEY_SYNC_META,
      JSON.stringify({ cachedAt: new Date().toISOString() } satisfies CacheMeta)
    )
  } catch {
    // storage might be full — silently ignore
  }
}

export function clearMembersCache(): void {
  localStorage.removeItem(STORAGE_KEY_MEMBERS)
  localStorage.removeItem(STORAGE_KEY_SYNC_META)
}

export function getLastSyncTime(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SYNC_META)
    if (!raw) return null
    const meta: CacheMeta = JSON.parse(raw)
    return meta.cachedAt
  } catch {
    return null
  }
}

// ─── Service functions ────────────────────────────────────────────────

/**
 * Fetches all members. Uses cache if fresh, otherwise fetches from adapter.
 * Pass `force = true` to bypass cache (e.g., after a mutation).
 */
export async function fetchMembers(force = false): Promise<Member[]> {
  if (!force) {
    const cached = getCachedMembers()
    if (cached) return cached
  }
  const members = await getAdapter().getMembers()
  setCachedMembers(members)
  return members
}

export async function fetchMemberById(id: string): Promise<Member | null> {
  return getAdapter().getMemberById(id)
}

export async function createMember(input: CreateMemberInput): Promise<Member> {
  const member = await getAdapter().createMember(input)
  clearMembersCache()
  return member
}

export async function updateMember(id: string, input: UpdateMemberInput): Promise<Member> {
  const member = await getAdapter().updateMember(id, input)
  clearMembersCache()
  return member
}

export async function deleteMember(id: string): Promise<void> {
  await getAdapter().deleteMember(id)
  clearMembersCache()
}

export async function syncMembersFromForms(): Promise<SyncResult> {
  const result = await getAdapter().syncMembersFromForms()
  if (result.success) clearMembersCache()
  return result
}
