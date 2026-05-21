import { apiClient } from '@/api/client'
import { NOTIFICATIONS_ENDPOINTS } from '@/features/notifications/consts/notifications_endpoints'

export const notifications_delete = (id: number): Promise<void> =>
  apiClient.delete(NOTIFICATIONS_ENDPOINTS.byId(id)).then(() => undefined)
