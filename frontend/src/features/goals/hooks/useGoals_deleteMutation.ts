import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { goals_delete } from '@/features/goals/api/goals_delete'
import { goalKeys } from '@/features/goals/apiKeys'

export const useGoals_deleteMutation = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: goals_delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all() })
    },
  })
}
