import { z } from 'zod'

export const MonthlyBreakdownSchema = z.object({
  year: z.number(),
  month: z.number(),
  income: z.number(),
  expenses: z.number(),
})

export const CategoryBreakdownSchema = z.object({
  categoryId: z.number(),
  categoryName: z.string(),
  amount: z.number(),
})

export type MonthlyBreakdown = z.infer<typeof MonthlyBreakdownSchema>
export type CategoryBreakdown = z.infer<typeof CategoryBreakdownSchema>
