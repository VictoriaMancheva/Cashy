import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { goals_create } from '@/features/goals/api/goals_create'
import { goalKeys } from '@/features/goals/apiKeys'
import type { Goal, GoalFormValues } from '@/features/goals/consts/goals_schemas'

export const useGoals_createMutation = (): UseMutationResult<Goal, Error, GoalFormValues> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: goals_create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all() })
    },
  })
}
