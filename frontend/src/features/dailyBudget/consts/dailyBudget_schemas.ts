import { z } from 'zod'

import { i18nKey } from '@/i18n/translate'

export const DailyBudgetSchema = z.object({
  id: z.number(),
  dailyLimit: z.number(),
  date: z.string(),
})

export const DailyBudgetFormSchema = z.object({
  dailyLimit: z.number().positive(i18nKey('validation.dailyLimitPositive')),
  date: z.string().optional(),
})

export const TodayBudgetSchema = z.object({
  date: z.string(),
  dailyLimit: z.number().nullable(),
  spentToday: z.number(),
  remainingToday: z.number().nullable(),
  source: z.enum(['MANUAL', 'CALCULATED', 'NONE']),
})

export type DailyBudget = z.infer<typeof DailyBudgetSchema>
export type DailyBudgetFormValues = z.infer<typeof DailyBudgetFormSchema>
export type TodayBudget = z.infer<typeof TodayBudgetSchema>
