import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { transactions_create } from '@/features/transactions/api/transactions_create'
import { transactionKeys } from '@/features/transactions/apiKeys'
import type { Transaction, TransactionFormValues } from '@/features/transactions/consts/transactions_schemas'

export const useTransactions_createMutation = (): UseMutationResult<Transaction, Error, TransactionFormValues> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: transactions_create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all() })
    },
  })
}
