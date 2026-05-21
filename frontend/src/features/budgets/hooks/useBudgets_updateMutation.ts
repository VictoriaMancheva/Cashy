import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { budgets_update } from '@/features/budgets/api/budgets_update'
import { budgetKeys } from '@/features/budgets/apiKeys'
import type { Budget, BudgetFormValues } from '@/features/budgets/consts/budgets_schemas'

export const useBudgets_updateMutation = (): UseMutationResult<
  Budget,
  Error,
  { id: number; data: BudgetFormValues }
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: budgets_update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all() })
    },
  })
}
