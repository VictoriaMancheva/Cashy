import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { recurringTransactions_delete } from '@/features/recurringTransactions/api/recurringTransactions_delete'
import { recurringTransactionKeys } from '@/features/recurringTransactions/apiKeys'

export const useRecurringTransactions_deleteMutation = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: recurringTransactions_delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringTransactionKeys.all() })
    },
  })
}
