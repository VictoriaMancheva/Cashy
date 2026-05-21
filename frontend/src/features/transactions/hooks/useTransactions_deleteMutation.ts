import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { transactions_delete } from '@/features/transactions/api/transactions_delete'
import { transactionKeys } from '@/features/transactions/apiKeys'

export const useTransactions_deleteMutation = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: transactions_delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all() })
    },
  })
}
