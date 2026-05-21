import { z } from 'zod'

import { apiClient } from '@/api/client'
import { CATEGORIES_ENDPOINTS } from '@/features/categories/consts/categories_endpoints'
import type { Category } from '@/features/categories/consts/categories_schemas'
import { CategorySchema } from '@/features/categories/consts/categories_schemas'

export const categories_fetchAll = (): Promise<Category[]> =>
  apiClient
    .get<unknown>(CATEGORIES_ENDPOINTS.base)
    .then((res) => z.array(CategorySchema).parse(res.data))
