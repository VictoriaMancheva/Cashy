import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { budgets_create } from '@/features/budgets/api/budgets_create'
import { budgetKeys } from '@/features/budgets/apiKeys'
import type { Budget, BudgetFormValues } from '@/features/budgets/consts/budgets_schemas'

export const useBudgets_createMutation = (): UseMutationResult<Budget, Error, BudgetFormValues> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: budgets_create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all() })
    },
  })
}
