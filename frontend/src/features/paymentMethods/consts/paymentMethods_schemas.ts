import { z } from 'zod'

import { i18nKey } from '@/i18n/translate'

export const PaymentMethodSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const PaymentMethodFormSchema = z.object({
  name: z.string().min(1, i18nKey('validation.nameRequired')),
})

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>
export type PaymentMethodFormValues = z.infer<typeof PaymentMethodFormSchema>
