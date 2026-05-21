import { apiClient } from '@/api/client'
import { RECURRING_TRANSACTIONS_ENDPOINTS } from '@/features/recurringTransactions/consts/recurringTransactions_endpoints'

export const recurringTransactions_delete = (id: number): Promise<void> =>
  apiClient.delete(RECURRING_TRANSACTIONS_ENDPOINTS.byId(id)).then(() => undefined)
