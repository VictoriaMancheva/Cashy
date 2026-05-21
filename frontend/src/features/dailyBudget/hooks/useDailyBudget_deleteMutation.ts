import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { dailyBudget_delete } from '@/features/dailyBudget/api/dailyBudget_delete'
import { dailyBudgetKeys } from '@/features/dailyBudget/apiKeys'

export const useDailyBudget_deleteMutation = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dailyBudget_delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyBudgetKeys.all() })
    },
  })
}
