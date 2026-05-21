import { apiClient } from '@/api/client'
import { CATEGORIES_ENDPOINTS } from '@/features/categories/consts/categories_endpoints'
import type { Category, CategoryFormValues } from '@/features/categories/consts/categories_schemas'
import { CategorySchema } from '@/features/categories/consts/categories_schemas'

export const categories_create = (data: CategoryFormValues): Promise<Category> =>
  apiClient
    .post<unknown>(CATEGORIES_ENDPOINTS.base, data)
    .then((res) => CategorySchema.parse(res.data))
