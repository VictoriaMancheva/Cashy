import { z } from 'zod'

import { apiClient } from '@/api/client'

export const SharedCategorySchema = z.object({ id: z.number(), name: z.string() })
export const SharedPaymentMethodSchema = z.object({ id: z.number(), name: z.string() })

export type SharedCategory = z.infer<typeof SharedCategorySchema>
export type SharedPaymentMethod = z.infer<typeof SharedPaymentMethodSchema>

export const shared_fetchCategories = (): Promise<SharedCategory[]> =>
  apiClient.get<unknown>('/api/categories').then((res) => z.array(SharedCategorySchema).parse(res.data))

export const shared_fetchPaymentMethods = (): Promise<SharedPaymentMethod[]> =>
  apiClient.get<unknown>('/api/payment-methods').then((res) => z.array(SharedPaymentMethodSchema).parse(res.data))
