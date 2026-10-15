export const ROLES = ['USER', 'PREMIUM', 'ADMIN'] as const

export type Role = (typeof ROLES)[number]

export const isRole = (value: string): value is Role => ROLES.some((role) => role === value)
