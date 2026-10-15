import { z } from 'zod'

import { i18nKey } from '@/i18n/translate'

export const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
  role: z.string(),
  createdAt: z.string().nullable(),
})

export const UsernameFormSchema = z.object({
  username: z.string().min(3, i18nKey('validation.usernameMin3')),
})

export const PasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, i18nKey('validation.currentPasswordRequired')),
    newPassword: z.string().min(6, i18nKey('validation.passwordMin6')),
    confirmPassword: z.string().min(1, i18nKey('validation.confirmPasswordRequired')),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: i18nKey('validation.passwordsMismatch'),
    path: ['confirmPassword'],
  })

export type User = z.infer<typeof UserSchema>
export type UsernameFormValues = z.infer<typeof UsernameFormSchema>
export type PasswordFormValues = z.infer<typeof PasswordFormSchema>
