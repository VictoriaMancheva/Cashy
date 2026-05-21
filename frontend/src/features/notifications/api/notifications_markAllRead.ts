import { apiClient } from '@/api/client'
import { NOTIFICATIONS_ENDPOINTS } from '@/features/notifications/consts/notifications_endpoints'

export const notifications_markAllRead = (): Promise<void> =>
  apiClient.patch(NOTIFICATIONS_ENDPOINTS.markAllRead).then(() => undefined)
