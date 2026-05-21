import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { categories_create } from '@/features/categories/api/categories_create'
import { categoryKeys } from '@/features/categories/apiKeys'
import type { Category, CategoryFormValues } from '@/features/categories/consts/categories_schemas'

export const useCategories_createMutation = (): UseMutationResult<Category, Error, CategoryFormValues> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: categories_create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all() })
    },
  })
}
