import { z } from 'zod'

export const PaymentMethodSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const PaymentMethodFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>
export type PaymentMethodFormValues = z.infer<typeof PaymentMethodFormSchema>
