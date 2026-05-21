import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { categories_delete } from '@/features/categories/api/categories_delete'
import { categoryKeys } from '@/features/categories/apiKeys'

export const useCategories_deleteMutation = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: categories_delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all() })
    },
  })
}
