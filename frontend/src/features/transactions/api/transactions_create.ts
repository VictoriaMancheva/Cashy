import { apiClient } from '@/api/client'
import { TRANSACTIONS_ENDPOINTS } from '@/features/transactions/consts/transactions_endpoints'
import type { Transaction, TransactionFormValues } from '@/features/transactions/consts/transactions_schemas'
import { TransactionSchema } from '@/features/transactions/consts/transactions_schemas'

export const transactions_create = (data: TransactionFormValues): Promise<Transaction> =>
  apiClient
    .post<unknown>(TRANSACTIONS_ENDPOINTS.base, data)
    .then((res) => TransactionSchema.parse(res.data))
