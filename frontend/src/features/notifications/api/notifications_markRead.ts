import { apiClient } from '@/api/client'
import { NOTIFICATIONS_ENDPOINTS } from '@/features/notifications/consts/notifications_endpoints'
import type { Notification } from '@/features/notifications/consts/notifications_schemas'
import { NotificationSchema } from '@/features/notifications/consts/notifications_schemas'

export const notifications_markRead = (id: number): Promise<Notification> =>
  apiClient
    .patch<unknown>(NOTIFICATIONS_ENDPOINTS.markRead(id))
    .then((res) => NotificationSchema.parse(res.data))
