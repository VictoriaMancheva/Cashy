import { apiClient } from '@/api/client'
import { TRANSACTIONS_ENDPOINTS } from '@/features/transactions/consts/transactions_endpoints'

export const transactions_delete = (id: number): Promise<void> =>
  apiClient.delete(TRANSACTIONS_ENDPOINTS.byId(id)).then(() => undefined)
