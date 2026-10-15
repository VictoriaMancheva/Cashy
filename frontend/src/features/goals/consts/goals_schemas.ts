import { z } from 'zod'

import { i18nKey } from '@/i18n/translate'

export const GoalSchema = z.object({
  id: z.number(),
  name: z.string(),
  targetAmount: z.number(),
  currentAmount: z.number(),
  deadline: z.string().nullable(),
  progressPercentage: z.number(),
})

export const GoalFormSchema = z.object({
  name: z.string().min(1, i18nKey('validation.nameRequired')),
  targetAmount: z.number().positive(i18nKey('validation.targetPositive')),
  currentAmount: z.number().min(0, i18nKey('validation.currentAmountMin')).optional(),
  deadline: z.string().optional(),
})

export type Goal = z.infer<typeof GoalSchema>
export type GoalFormValues = z.infer<typeof GoalFormSchema>
