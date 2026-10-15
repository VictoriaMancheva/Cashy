import { z } from 'zod'

import { i18nKey } from '@/i18n/translate'

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const CategoryFormSchema = z.object({
  name: z.string().min(1, i18nKey('validation.nameRequired')),
})

export type Category = z.infer<typeof CategorySchema>
export type CategoryFormValues = z.infer<typeof CategoryFormSchema>
