import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { goals_update } from '@/features/goals/api/goals_update'
import { goalKeys } from '@/features/goals/apiKeys'
import type { Goal, GoalFormValues } from '@/features/goals/consts/goals_schemas'

type UpdateGoalArgs = {
  id: number
  data: GoalFormValues
}

export const useGoals_updateMutation = (): UseMutationResult<Goal, Error, UpdateGoalArgs> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: goals_update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all() })
    },
  })
}
