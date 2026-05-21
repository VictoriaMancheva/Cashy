import { z } from 'zod'

export const GoalSchema = z.object({
  id: z.number(),
  name: z.string(),
  targetAmount: z.number(),
  currentAmount: z.number(),
  deadline: z.string().nullable(),
  progressPercentage: z.number(),
})

export const GoalFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  targetAmount: z.number().positive('Target amount must be positive'),
  currentAmount: z.number().min(0, 'Current amount must be 0 or more').optional(),
  deadline: z.string().optional(),
})

export type Goal = z.infer<typeof GoalSchema>
export type GoalFormValues = z.infer<typeof GoalFormSchema>
