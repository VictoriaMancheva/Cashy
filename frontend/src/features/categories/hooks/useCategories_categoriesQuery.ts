import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { categories_fetchAll } from '@/features/categories/api/categories_fetchAll'
import { categoryKeys } from '@/features/categories/apiKeys'
import type { Category } from '@/features/categories/consts/categories_schemas'

export const useCategories_categoriesQuery = (): UseQueryResult<Category[]> =>
  useQuery({
    queryKey: categoryKeys.all(),
    queryFn: categories_fetchAll,
  })
