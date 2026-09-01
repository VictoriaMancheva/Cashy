import { z } from 'zod'

export const AdminUserSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
  role: z.enum(['USER', 'PREMIUM', 'ADMIN']),
  createdAt: z.string().nullable(),
})

export const RoleUpdateFormSchema = z.object({
  role: z.enum(['USER', 'PREMIUM', 'ADMIN']),
})

export type AdminUser = z.infer<typeof AdminUserSchema>
export type RoleUpdateFormValues = z.infer<typeof RoleUpdateFormSchema>
