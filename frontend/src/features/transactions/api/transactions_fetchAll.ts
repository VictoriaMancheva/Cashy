import { z } from 'zod'

import { apiClient } from '@/api/client'
import { TRANSACTIONS_ENDPOINTS } from '@/features/transactions/consts/transactions_endpoints'
import type { Transaction } from '@/features/transactions/consts/transactions_schemas'
import { TransactionSchema } from '@/features/transactions/consts/transactions_schemas'

export const transactions_fetchAll = (): Promise<Transaction[]> =>
  apiClient
    .get<unknown>(TRANSACTIONS_ENDPOINTS.base)
    .then((res) => z.array(TransactionSchema).parse(res.data))
