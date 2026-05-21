import { apiClient } from '@/api/client'
import { CATEGORIES_ENDPOINTS } from '@/features/categories/consts/categories_endpoints'
import type { Category, CategoryFormValues } from '@/features/categories/consts/categories_schemas'
import { CategorySchema } from '@/features/categories/consts/categories_schemas'

type UpdateCategoryArgs = {
  id: number
  data: CategoryFormValues
}

export const categories_update = ({ id, data }: UpdateCategoryArgs): Promise<Category> =>
  apiClient
    .put<unknown>(CATEGORIES_ENDPOINTS.byId(id), data)
    .then((res) => CategorySchema.parse(res.data))
