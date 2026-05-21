import { z } from 'zod'

export const BudgetCategorySchema = z.object({
  id: z.number(),
  categoryId: z.number(),
  categoryName: z.string(),
  limitAmount: z.number(),
})

export const BudgetSchema = z.object({
  id: z.number(),
  totalAmount: z.number(),
  month: z.number(),
  year: z.number(),
  categories: z.array(BudgetCategorySchema),
})

export const BudgetCategoryFormSchema = z.object({
  categoryId: z.number(),
  limitAmount: z.number().positive('Limit must be positive'),
})

export const BudgetFormSchema = z.object({
  totalAmount: z.number().positive('Total amount must be positive'),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
  categories: z.array(BudgetCategoryFormSchema).optional(),
})

export type BudgetCategory = z.infer<typeof BudgetCategorySchema>
export type Budget = z.infer<typeof BudgetSchema>
export type BudgetCategoryFormValues = z.infer<typeof BudgetCategoryFormSchema>
export type BudgetFormValues = z.infer<typeof BudgetFormSchema>
