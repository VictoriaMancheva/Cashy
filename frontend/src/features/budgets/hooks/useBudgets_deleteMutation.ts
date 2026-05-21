import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { budgets_delete } from '@/features/budgets/api/budgets_delete'
import { budgetKeys } from '@/features/budgets/apiKeys'

export const useBudgets_deleteMutation = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: budgets_delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all() })
    },
  })
}
