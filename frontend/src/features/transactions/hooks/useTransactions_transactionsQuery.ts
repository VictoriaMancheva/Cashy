import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { transactions_fetchAll } from '@/features/transactions/api/transactions_fetchAll'
import { transactionKeys } from '@/features/transactions/apiKeys'
import type { Transaction, TransactionFilters } from '@/features/transactions/consts/transactions_schemas'

export const useTransactions_transactionsQuery = (filters: TransactionFilters): UseQueryResult<Transaction[]> =>
  useQuery({
    queryKey: transactionKeys.filtered(filters),
    queryFn: () => transactions_fetchAll(filters),
  })
