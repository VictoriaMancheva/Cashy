import { z } from 'zod'

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const CategoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export type Category = z.infer<typeof CategorySchema>
export type CategoryFormValues = z.infer<typeof CategoryFormSchema>
