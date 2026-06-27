/** Generates a UUID v4 using the Web Crypto API (browser-native, no library needed) */
export function generateUUID(): string {
  return crypto.randomUUID()
}

/**
 * Generates a sequential community ID: "RC-001", "RC-002", etc.
 * @param existingMembers — pass current member list to determine next number
 */
export function generateCommunityId(existingCount: number): string {
  const next = existingCount + 1
  return `RC-${String(next).padStart(3, '0')}`
}
