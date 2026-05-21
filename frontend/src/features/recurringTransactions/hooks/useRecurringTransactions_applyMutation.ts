import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { recurringTransactions_apply } from '@/features/recurringTransactions/api/recurringTransactions_apply'
import { recurringTransactionKeys } from '@/features/recurringTransactions/apiKeys'
import type { RecurringTransaction } from '@/features/recurringTransactions/consts/recurringTransactions_schemas'

export const useRecurringTransactions_applyMutation = (): UseMutationResult<RecurringTransaction, Error, number> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: recurringTransactions_apply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringTransactionKeys.all() })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
