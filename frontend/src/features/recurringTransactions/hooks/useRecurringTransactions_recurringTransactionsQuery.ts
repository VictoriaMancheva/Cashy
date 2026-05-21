import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { recurringTransactions_fetchAll } from '@/features/recurringTransactions/api/recurringTransactions_fetchAll'
import { recurringTransactionKeys } from '@/features/recurringTransactions/apiKeys'
import type { RecurringTransaction } from '@/features/recurringTransactions/consts/recurringTransactions_schemas'

export const useRecurringTransactions_recurringTransactionsQuery = (): UseQueryResult<RecurringTransaction[]> =>
  useQuery({
    queryKey: recurringTransactionKeys.all(),
    queryFn: recurringTransactions_fetchAll,
  })
