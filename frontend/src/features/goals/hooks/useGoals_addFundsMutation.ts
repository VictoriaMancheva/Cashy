import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { goals_addFunds } from '@/features/goals/api/goals_addFunds'
import { goalKeys } from '@/features/goals/apiKeys'
import type { Goal } from '@/features/goals/consts/goals_schemas'

type AddFundsArgs = {
  id: number
  amount: number
}

export const useGoals_addFundsMutation = (): UseMutationResult<Goal, Error, AddFundsArgs> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: goals_addFunds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all() })
    },
  })
}
