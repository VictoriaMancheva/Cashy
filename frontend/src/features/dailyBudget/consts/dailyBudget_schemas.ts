import { z } from 'zod'

export const DailyBudgetSchema = z.object({
  id: z.number(),
  dailyLimit: z.number(),
  date: z.string(),
})

export const DailyBudgetFormSchema = z.object({
  dailyLimit: z.number().positive(),
  date: z.string().optional(),
})

export type DailyBudget = z.infer<typeof DailyBudgetSchema>
export type DailyBudgetFormValues = z.infer<typeof DailyBudgetFormSchema>
