import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { notifications_fetchAll } from '@/features/notifications/api/notifications_fetchAll'
import { notificationKeys } from '@/features/notifications/apiKeys'
import type { Notification } from '@/features/notifications/consts/notifications_schemas'

export const useNotifications_notificationsQuery = (): UseQueryResult<Notification[]> =>
  useQuery({ queryKey: notificationKeys.all(), queryFn: notifications_fetchAll })
