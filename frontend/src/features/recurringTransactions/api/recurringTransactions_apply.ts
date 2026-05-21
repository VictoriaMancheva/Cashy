import { apiClient } from '@/api/client'
import { RECURRING_TRANSACTIONS_ENDPOINTS } from '@/features/recurringTransactions/consts/recurringTransactions_endpoints'
import type { RecurringTransaction } from '@/features/recurringTransactions/consts/recurringTransactions_schemas'
import { RecurringTransactionSchema } from '@/features/recurringTransactions/consts/recurringTransactions_schemas'

export const recurringTransactions_apply = (id: number): Promise<RecurringTransaction> =>
  apiClient
    .post<unknown>(RECURRING_TRANSACTIONS_ENDPOINTS.apply(id))
    .then((res) => RecurringTransactionSchema.parse(res.data))
