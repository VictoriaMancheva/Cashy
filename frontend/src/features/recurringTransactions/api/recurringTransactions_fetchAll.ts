import { z } from 'zod'

import { apiClient } from '@/api/client'
import { RECURRING_TRANSACTIONS_ENDPOINTS } from '@/features/recurringTransactions/consts/recurringTransactions_endpoints'
import type { RecurringTransaction } from '@/features/recurringTransactions/consts/recurringTransactions_schemas'
import { RecurringTransactionSchema } from '@/features/recurringTransactions/consts/recurringTransactions_schemas'

export const recurringTransactions_fetchAll = (): Promise<RecurringTransaction[]> =>
  apiClient
    .get<unknown>(RECURRING_TRANSACTIONS_ENDPOINTS.base)
    .then((res) => z.array(RecurringTransactionSchema).parse(res.data))
