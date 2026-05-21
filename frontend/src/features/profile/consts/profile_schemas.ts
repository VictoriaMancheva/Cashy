import { z } from 'zod'

export const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
  role: z.string(),
  createdAt: z.string().nullable(),
})

export const UsernameFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
})

export const PasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type User = z.infer<typeof UserSchema>
export type UsernameFormValues = z.infer<typeof UsernameFormSchema>
export type PasswordFormValues = z.infer<typeof PasswordFormSchema>
