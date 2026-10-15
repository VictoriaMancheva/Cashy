import { z } from 'zod'

export const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED'] as const

export const CheckoutSessionSchema = z.object({
  sessionId: z.string(),
  url: z.string(),
})

export const PaymentSchema = z.object({
  id: z.number(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(PAYMENT_STATUSES),
  createdAt: z.string().nullable(),
  paidAt: z.string().nullable(),
})

export type CheckoutSession = z.infer<typeof CheckoutSessionSchema>
export type Payment = z.infer<typeof PaymentSchema>
