import { z } from 'zod'

export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'] as const
export const FREQUENCIES = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const

export const RecurringTransactionSchema = z.object({
  id: z.number(),
  amount: z.number(),
  description: z.string().nullable(),
  frequency: z.enum(FREQUENCIES),
  type: z.enum(TRANSACTION_TYPES),
  nextDate: z.string().nullable(),
  createdAt: z.string().nullable(),
  categoryId: z.number().nullable(),
  categoryName: z.string().nullable(),
  paymentMethodId: z.number().nullable(),
  paymentMethodName: z.string().nullable(),
})

export const RecurringTransactionFormSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
  frequency: z.enum(FREQUENCIES),
  type: z.enum(TRANSACTION_TYPES),
  nextDate: z.string().optional(),
  categoryId: z.number().nullable().optional(),
  paymentMethodId: z.number().nullable().optional(),
})

export type RecurringTransaction = z.infer<typeof RecurringTransactionSchema>
export type RecurringTransactionFormValues = z.infer<typeof RecurringTransactionFormSchema>
export type Frequency = (typeof FREQUENCIES)[number]
