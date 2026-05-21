import { apiClient } from '@/api/client'
import { DAILY_BUDGET_ENDPOINTS } from '@/features/dailyBudget/consts/dailyBudget_endpoints'

export const dailyBudget_delete = (id: number): Promise<void> =>
  apiClient.delete(DAILY_BUDGET_ENDPOINTS.byId(id)).then(() => undefined)
