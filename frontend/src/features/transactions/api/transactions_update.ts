import { apiClient } from '@/api/client'
import { TRANSACTIONS_ENDPOINTS } from '@/features/transactions/consts/transactions_endpoints'
import type { Transaction, TransactionFormValues } from '@/features/transactions/consts/transactions_schemas'
import { TransactionSchema } from '@/features/transactions/consts/transactions_schemas'

export const transactions_update = ({
  id,
  data,
}: {
  id: number
  data: TransactionFormValues
}): Promise<Transaction> =>
  apiClient
    .put<unknown>(TRANSACTIONS_ENDPOINTS.byId(id), data)
    .then((res) => TransactionSchema.parse(res.data))
