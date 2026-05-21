import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { recurringTransactions_update } from '@/features/recurringTransactions/api/recurringTransactions_update'
import { recurringTransactionKeys } from '@/features/recurringTransactions/apiKeys'
import type { RecurringTransaction, RecurringTransactionFormValues } from '@/features/recurringTransactions/consts/recurringTransactions_schemas'

export const useRecurringTransactions_updateMutation = (): UseMutationResult<
  RecurringTransaction,
  Error,
  { id: number; data: RecurringTransactionFormValues }
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: recurringTransactions_update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringTransactionKeys.all() })
    },
  })
}
