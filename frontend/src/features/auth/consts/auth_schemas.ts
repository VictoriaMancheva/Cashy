import { z } from 'zod'

import { i18nKey } from '@/i18n/translate'

export const LoginSchema = z.object({
  email: z.string().email(i18nKey('validation.emailInvalid')),
  password: z.string().min(1, i18nKey('validation.passwordRequired')),
})

export const RegisterSchema = z.object({
  email: z.string().email(i18nKey('validation.emailInvalid')),
  username: z.string().min(2, i18nKey('validation.usernameMin2')),
  password: z.string().min(6, i18nKey('validation.passwordMin6')),
})

export const AuthResponseSchema = z.object({
  token: z.string(),
})

export type LoginFormValues = z.infer<typeof LoginSchema>
export type RegisterFormValues = z.infer<typeof RegisterSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
