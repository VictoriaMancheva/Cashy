import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { dailyBudget_set } from '@/features/dailyBudget/api/dailyBudget_set'
import { dailyBudgetKeys } from '@/features/dailyBudget/apiKeys'
import type { DailyBudget, DailyBudgetFormValues } from '@/features/dailyBudget/consts/dailyBudget_schemas'

export const useDailyBudget_setMutation = (): UseMutationResult<DailyBudget, Error, DailyBudgetFormValues> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dailyBudget_set,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dailyBudgetKeys.all() })
    },
  })
}
