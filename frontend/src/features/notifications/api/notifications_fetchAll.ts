import { z } from 'zod'

import { apiClient } from '@/api/client'
import { NOTIFICATIONS_ENDPOINTS } from '@/features/notifications/consts/notifications_endpoints'
import type { Notification } from '@/features/notifications/consts/notifications_schemas'
import { NotificationSchema } from '@/features/notifications/consts/notifications_schemas'

export const notifications_fetchAll = (): Promise<Notification[]> =>
  apiClient
    .get<unknown>(NOTIFICATIONS_ENDPOINTS.base)
    .then((res) => z.array(NotificationSchema).parse(res.data))
