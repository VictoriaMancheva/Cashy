import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { recurringTransactions_create } from '@/features/recurringTransactions/api/recurringTransactions_create'
import { recurringTransactionKeys } from '@/features/recurringTransactions/apiKeys'
import type { RecurringTransaction, RecurringTransactionFormValues } from '@/features/recurringTransactions/consts/recurringTransactions_schemas'

export const useRecurringTransactions_createMutation = (): UseMutationResult<
  RecurringTransaction,
  Error,
  RecurringTransactionFormValues
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: recurringTransactions_create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringTransactionKeys.all() })
    },
  })
}
