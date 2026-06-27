import { IDataAdapter } from './adapter.interface'
import { Member, CreateMemberInput, UpdateMemberInput, SyncResult, ReadingInterest } from '@/types'
import { generateUUID, generateCommunityId } from '@/utils/uuid'
import { nowISO } from '@/utils/dateHelpers'

// ─── Seed Data ────────────────────────────────────────────────────────
// 15 realistic members from the Vidarbha / Maharashtra region
const SEED_MEMBERS: Member[] = [
  {
    id: 'a1b2c3d4-0001-4000-8000-aabbccddeeff',
    communityId: 'RC-001',
    fullName: 'Aryan Deshmukh',
    email: 'aryan.deshmukh@gmail.com',
    phone: '+919420133456',
    city: 'Amravati',
    dateJoined: '2024-08-15',
    readingInterests: ['Fiction', 'History', 'Philosophy'] as ReadingInterest[],
    membershipStatus: 'active',
    notes: 'Founding organizer. Very active in discussions.',
    sourceFormResponseId: 'seed-001',
    createdAt: '2024-08-15T10:00:00Z',
    updatedAt: '2024-08-15T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0002-4000-8000-aabbccddeeff',
    communityId: 'RC-002',
    fullName: 'Priya Kulkarni',
    email: 'priya.kulkarni@gmail.com',
    phone: '+919876543210',
    city: 'Amravati',
    dateJoined: '2024-08-15',
    readingInterests: ['Fiction', 'Self-Help', 'Biography'] as ReadingInterest[],
    membershipStatus: 'active',
    notes: 'Co-organizer. Handles event logistics.',
    sourceFormResponseId: 'seed-002',
    createdAt: '2024-08-15T10:05:00Z',
    updatedAt: '2024-09-01T08:00:00Z',
  },
  {
    id: 'a1b2c3d4-0003-4000-8000-aabbccddeeff',
    communityId: 'RC-003',
    fullName: 'Kavya Joshi',
    email: 'kavya.joshi@outlook.com',
    phone: '+918765432109',
    city: 'Nagpur',
    dateJoined: '2024-09-01',
    readingInterests: ['Fiction', 'Mystery', 'Poetry'] as ReadingInterest[],
    membershipStatus: 'active',
    notes: '',
    sourceFormResponseId: 'seed-003',
    createdAt: '2024-09-01T09:00:00Z',
    updatedAt: '2024-09-01T09:00:00Z',
  },
  {
    id: 'a1b2c3d4-0004-4000-8000-aabbccddeeff',
    communityId: 'RC-004',
    fullName: 'Rohit Patel',
    email: 'rohit.patel@yahoo.com',
    phone: '+917654321098',
    city: 'Amravati',
    dateJoined: '2024-09-10',
    readingInterests: ['Non-Fiction', 'Science', 'History'] as ReadingInterest[],
    membershipStatus: 'active',
    notes: 'Brings 2-3 friends to every meetup.',
    sourceFormResponseId: 'seed-004',
    createdAt: '2024-09-10T11:00:00Z',
    updatedAt: '2024-09-10T11:00:00Z',
  },
  {
    id: 'a1b2c3d4-0005-4000-8000-aabbccddeeff',
    communityId: 'RC-005',
    fullName: 'Meera Sharma',
    email: 'meera.sharma@gmail.com',
    phone: '+916543210987',
    city: 'Pune',
    dateJoined: '2024-10-01',
    readingInterests: ['Fiction', 'Fantasy', 'Self-Help'] as ReadingInterest[],
    membershipStatus: 'active',
    notes: 'Remote member. Attends online sessions.',
    sourceFormResponseId: 'seed-005',
    createdAt: '2024-10-01T14:00:00Z',
    updatedAt: '2024-10-01T14:00:00Z',
  },
  {
    id: 'a1b2c3d4-0006-4000-8000-aabbccddeeff',
    communityId: 'RC-006',
    fullName: 'Nikhil Wankhede',
    email: 'nikhil.wankhede@gmail.com',
    phone: '+919456789012',
    city: 'Amravati',
    dateJoined: '2024-10-15',
    readingInterests: ['History', 'Biography', 'Non-Fiction'] as ReadingInterest[],
    membershipStatus: 'paused',
    notes: 'On sabbatical. Will return in January.',
    sourceFormResponseId: 'seed-006',
    createdAt: '2024-10-15T09:30:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0007-4000-8000-aabbccddeeff',
    communityId: 'RC-007',
    fullName: 'Ananya Bhatt',
    email: 'ananya.bhatt@gmail.com',
    phone: '+918345678901',
    city: 'Akola',
    dateJoined: '2024-11-01',
    readingInterests: ['Fiction', 'Poetry', 'Regional Language'] as ReadingInterest[],
    membershipStatus: 'active',
    notes: '',
    sourceFormResponseId: 'seed-007',
    createdAt: '2024-11-01T16:00:00Z',
    updatedAt: '2024-11-01T16:00:00Z',
  },
  {
    id: 'a1b2c3d4-0008-4000-8000-aabbccddeeff',
    communityId: 'RC-008',
    fullName: 'Siddharth Raje',
    email: 'siddharth.raje@gmail.com',
    phone: '+917234567890',
    city: 'Amravati',
    dateJoined: '2024-11-20',
    readingInterests: ['Philosophy', 'Self-Help', 'Science'] as ReadingInterest[],
    membershipStatus: 'active',
    notes: 'Keen on starting a Philosophy sub-group.',
    sourceFormResponseId: 'seed-008',
    createdAt: '2024-11-20T13:00:00Z',
    updatedAt: '2024-11-20T13:00:00Z',
  },
  {
    id: 'a1b2c3d4-0009-4000-8000-aabbccddeeff',
    communityId: 'RC-009',
    fullName: 'Pooja Munde',
    email: 'pooja.munde@gmail.com',
    phone: '+919123456789',
    city: 'Yavatmal',
    dateJoined: '2024-12-05',
    readingInterests: ['Fiction', 'Mystery', 'Biography'] as ReadingInterest[],
    membershipStatus: 'active',
    notes: '',
    sourceFormResponseId: 'seed-009',
    createdAt: '2024-12-05T11:00:00Z',
    updatedAt: '2024-12-05T11:00:00Z',
  },
  {
    id: 'a1b2c3d4-0010-4000-8000-aabbccddeeff',
    communityId: 'RC-010',
    fullName: 'Vivek Gawande',
    email: 'vivek.gawande@gmail.com',
    phone: '+918012345678',
    city: 'Amravati',
    dateJoined: '2025-01-08',
    readingInterests: ['Non-Fiction', 'History'] as ReadingInterest[],
    membershipStatus: 'active',
    notes: '',
    sourceFormResponseId: 'seed-010',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0011-4000-8000-aabbccddeeff',
    communityId: 'RC-011',
    fullName: 'Tanvi Ingole',
    email: 'tanvi.ingole@gmail.com',
    phone: '+919987654321',
    city: 'Amravati',
    dateJoined: '2025-02-14',
    readingInterests: ['Fiction', 'Romance', 'Fantasy'] as ReadingInterest[],
    membershipStatus: 'inactive',
    notes: 'Has not attended last 3 events. Follow up.',
    sourceFormResponseId: 'seed-011',
    createdAt: '2025-02-14T09:00:00Z',
    updatedAt: '2025-05-01T12:00:00Z',
  },
  {
    id: 'a1b2c3d4-0012-4000-8000-aabbccddeeff',
    communityId: 'RC-012',
    fullName: 'Gaurav Thakare',
    email: 'gaurav.thakare@gmail.com',
    phone: '+918876543210',
    city: 'Nagpur',
    dateJoined: '2025-03-01',
    readingInterests: ['Science', 'Non-Fiction', 'History'] as ReadingInterest[],
    membershipStatus: 'active',
    notes: 'Engineer. Prefers technical and science books.',
    sourceFormResponseId: 'seed-012',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0013-4000-8000-aabbccddeeff',
    communityId: 'RC-013',
    fullName: 'Sneha Pawar',
    email: 'sneha.pawar@gmail.com',
    phone: '+917765432109',
    city: 'Amravati',
    dateJoined: '2025-04-10',
    readingInterests: ['Self-Help', 'Biography', 'Fiction'] as ReadingInterest[],
    membershipStatus: 'active',
    notes: '',
    sourceFormResponseId: 'seed-013',
    createdAt: '2025-04-10T15:00:00Z',
    updatedAt: '2025-04-10T15:00:00Z',
  },
  {
    id: 'a1b2c3d4-0014-4000-8000-aabbccddeeff',
    communityId: 'RC-014',
    fullName: 'Rahul Naik',
    email: 'rahul.naik@gmail.com',
    phone: '+916654321098',
    city: 'Amravati',
    dateJoined: '2025-05-05',
    readingInterests: ['Fiction', 'Mystery'] as ReadingInterest[],
    membershipStatus: 'pending',
    notes: 'Filled form — awaiting first event attendance.',
    sourceFormResponseId: 'seed-014',
    createdAt: '2025-05-05T11:00:00Z',
    updatedAt: '2025-05-05T11:00:00Z',
  },
  {
    id: 'a1b2c3d4-0015-4000-8000-aabbccddeeff',
    communityId: 'RC-015',
    fullName: 'Ishika Deshpande',
    email: 'ishika.deshpande@gmail.com',
    phone: '+915543210987',
    city: 'Amravati',
    dateJoined: '2025-06-10',
    readingInterests: ['Children', 'Fiction', 'Poetry'] as ReadingInterest[],
    membershipStatus: 'active',
    notes: "Teacher. Interested in children's literature section.",
    sourceFormResponseId: 'seed-015',
    createdAt: '2025-06-10T09:00:00Z',
    updatedAt: '2025-06-10T09:00:00Z',
  },
]

// ─── LocalStorage Persistence Synchronization Layer ───────────────────
const STORAGE_KEY = 'rcms_members_v1' // versioned key for future migrations

let _cache: Member[] | null = null

/** Normalize phone to E.164-ish: +91xxxxxxxxxx, no spaces */
const normalizePhone = (phone: string): string => phone.replace(/\s+/g, '')

/** Reads current state from LocalStorage, falling back to seed data if empty */
const getStoredMembers = (): Member[] => {
  if (typeof window === 'undefined') return SEED_MEMBERS
  if (_cache) return _cache

  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) {
    const normalizedSeed = SEED_MEMBERS.map(m => ({...m, phone: normalizePhone(m.phone) }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedSeed))
    _cache = normalizedSeed
    return _cache
  }

  try {
    const parsed = JSON.parse(saved) as Member[]
    _cache = parsed
    return parsed
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    _cache = SEED_MEMBERS
    return _cache
  }
}

/** Saves array back to LocalStorage */
const saveStoredMembers = (members: Member[]): void => {
  _cache = members
  if (typeof window!== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
  }
}

/** Simulates network latency for realistic UX development */
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

// ─── Mock Adapter Implementation ─────────────────────────────────────
export class MockAdapter implements IDataAdapter {
  async getMembers(): Promise<Member[]> {
    await delay(350)
    const currentMembers = getStoredMembers()
    return [...currentMembers].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  async getMemberById(id: string): Promise<Member | null> {
    await delay(150)
    const currentMembers = getStoredMembers()
    return currentMembers.find((m) => m.id === id)?? null
  }

  async createMember(input: CreateMemberInput): Promise<Member> {
    await delay(400)
    const currentMembers = getStoredMembers()

    const emailExists = currentMembers.some(
      m => m.email.toLowerCase() === input.email.toLowerCase()
    )
    if (emailExists) {
      throw new Error(`Member with email "${input.email}" already exists.`)
    }

    const communityId = generateCommunityId(currentMembers.length)
    const now = nowISO()
    const newMember: Member = {
     ...input,
      id: generateUUID(),
      communityId,
      phone: normalizePhone(input.phone),
      sourceFormResponseId: `manual-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }

    saveStoredMembers([...currentMembers, newMember])
    return newMember
  }

  async updateMember(id: string, input: UpdateMemberInput): Promise<Member> {
    await delay(300)
    const currentMembers = getStoredMembers()
    const idx = currentMembers.findIndex((m) => m.id === id)
    if (idx === -1) throw new Error(`Member with id "${id}" not found.`)

    // Check email uniqueness if email is being updated
    if (input.email) {
      const emailExists = currentMembers.some(
        m => m.id!== id && m.email.toLowerCase() === input.email!.toLowerCase()
      )
      if (emailExists) {
        throw new Error(`Another member with email "${input.email}" already exists.`)
      }
    }

    const updated: Member = {
     ...currentMembers[idx],
     ...input,
      phone: input.phone? normalizePhone(input.phone) : currentMembers[idx].phone,
      updatedAt: nowISO(),
    }

    const updatedList = currentMembers.map((m) => (m.id === id? updated : m))
    saveStoredMembers(updatedList)
    return updated
  }

  async deleteMember(id: string): Promise<void> {
    await delay(300)
    const currentMembers = getStoredMembers()
    if (!currentMembers.some(m => m.id === id)) {
      throw new Error(`Member with id "${id}" not found.`)
    }
    const filteredList = currentMembers.filter((m) => m.id!== id)
    saveStoredMembers(filteredList)
  }

  async syncMembersFromForms(): Promise<SyncResult> {
    await delay(1200)
    const currentMembers = getStoredMembers()

    // Simulate 1-2 new members coming from Google Forms
    const newMembers: Member[] = []
    const count = Math.floor(Math.random() * 2) + 1 // 1-2

    for (let i = 0; i < count; i++) {
      const now = nowISO()
      const mockNew: Member = {
        id: generateUUID(),
        communityId: generateCommunityId(currentMembers.length + i),
        fullName: `Form User ${Date.now() + i}`,
        email: `formuser${Date.now() + i}@test.com`,
        phone: '+919000000000',
        city: 'Amravati',
        dateJoined: now.split('T')[0],
        readingInterests: ['Fiction'],
        membershipStatus: 'pending',
        notes: 'Synced from Google Forms',
        sourceFormResponseId: `forms-${Date.now() + i}`,
        createdAt: now,
        updatedAt: now,
      }
      newMembers.push(mockNew)
    }

    saveStoredMembers([...currentMembers,...newMembers])

    return {
      success: true,
      recordsSynced: newMembers.length,
      timestamp: nowISO(),
    }
  }

  /** Dev utility: reset localStorage to seed data */
  async resetToSeed(): Promise<void> {
    await delay(200)
    _cache = null
    if (typeof window!== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
}
