import { apiClient } from '@/api/client'
import { BUDGETS_ENDPOINTS } from '@/features/budgets/consts/budgets_endpoints'

export const budgets_delete = (id: number): Promise<void> =>
  apiClient.delete(BUDGETS_ENDPOINTS.byId(id)).then(() => undefined)
