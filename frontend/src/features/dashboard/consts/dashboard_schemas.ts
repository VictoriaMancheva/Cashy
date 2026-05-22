import { z } from 'zod'

import { TransactionSchema } from '@/features/transactions/consts/transactions_schemas'

export const DashboardSummarySchema = z.object({
  totalIncome: z.number(),
  totalExpenses: z.number(),
  netBalance: z.number(),
  currentMonthIncome: z.number(),
  currentMonthExpenses: z.number(),
  recentTransactions: z.array(TransactionSchema),
})

export type DashboardSummary = z.infer<typeof DashboardSummarySchema>
