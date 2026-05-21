import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { categories_update } from '@/features/categories/api/categories_update'
import { categoryKeys } from '@/features/categories/apiKeys'
import type { Category, CategoryFormValues } from '@/features/categories/consts/categories_schemas'

type UpdateCategoryArgs = {
  id: number
  data: CategoryFormValues
}

export const useCategories_updateMutation = (): UseMutationResult<Category, Error, UpdateCategoryArgs> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: categories_update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all() })
    },
  })
}
