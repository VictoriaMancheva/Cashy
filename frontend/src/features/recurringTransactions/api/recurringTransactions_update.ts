import { apiClient } from '@/api/client'
import { RECURRING_TRANSACTIONS_ENDPOINTS } from '@/features/recurringTransactions/consts/recurringTransactions_endpoints'
import type { RecurringTransaction, RecurringTransactionFormValues } from '@/features/recurringTransactions/consts/recurringTransactions_schemas'
import { RecurringTransactionSchema } from '@/features/recurringTransactions/consts/recurringTransactions_schemas'

export const recurringTransactions_update = ({
  id,
  data,
}: {
  id: number
  data: RecurringTransactionFormValues
}): Promise<RecurringTransaction> =>
  apiClient
    .put<unknown>(RECURRING_TRANSACTIONS_ENDPOINTS.byId(id), data)
    .then((res) => RecurringTransactionSchema.parse(res.data))
