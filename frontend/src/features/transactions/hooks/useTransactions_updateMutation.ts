import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { transactions_update } from '@/features/transactions/api/transactions_update'
import { transactionKeys } from '@/features/transactions/apiKeys'
import type { Transaction, TransactionFormValues } from '@/features/transactions/consts/transactions_schemas'

export const useTransactions_updateMutation = (): UseMutationResult<
  Transaction,
  Error,
  { id: number; data: TransactionFormValues }
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: transactions_update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all() })
    },
  })
}
