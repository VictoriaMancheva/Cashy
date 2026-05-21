import { z } from 'zod'

export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'] as const

export const TransactionSchema = z.object({
  id: z.number(),
  amount: z.number(),
  type: z.enum(TRANSACTION_TYPES),
  description: z.string().nullable(),
  date: z.string().nullable(),
  receiptImage: z.string().nullable(),
  categoryId: z.number().nullable(),
  categoryName: z.string().nullable(),
  paymentMethodId: z.number().nullable(),
  paymentMethodName: z.string().nullable(),
})

export const TransactionFormSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(TRANSACTION_TYPES),
  description: z.string().optional(),
  date: z.string().optional(),
  categoryId: z.number().nullable().optional(),
  paymentMethodId: z.number().nullable().optional(),
})

export type Transaction = z.infer<typeof TransactionSchema>
export type TransactionFormValues = z.infer<typeof TransactionFormSchema>
export type TransactionType = (typeof TRANSACTION_TYPES)[number]
