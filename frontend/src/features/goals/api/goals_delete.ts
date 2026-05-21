import { apiClient } from '@/api/client'
import { GOALS_ENDPOINTS } from '@/features/goals/consts/goals_endpoints'

export const goals_delete = (id: number): Promise<void> =>
  apiClient.delete(GOALS_ENDPOINTS.byId(id)).then(() => undefined)
