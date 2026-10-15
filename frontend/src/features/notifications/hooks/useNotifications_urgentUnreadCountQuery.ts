import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { notifications_fetchAll } from '@/features/notifications/api/notifications_fetchAll'
import { notificationKeys } from '@/features/notifications/apiKeys'
import { URGENT_POLL_INTERVAL_MS } from '@/features/notifications/consts/notifications_constants'
import type { Notification } from '@/features/notifications/consts/notifications_schemas'

const countUrgentUnread = (notifications: Notification[]): number =>
  notifications.filter((n) => n.priority === 'URGENT' && !n.isRead).length

// Shares the cache with the notifications list and polls so new alerts show up without a reload
export const useNotifications_urgentUnreadCountQuery = (): UseQueryResult<number> =>
  useQuery({
    queryKey: notificationKeys.all(),
    queryFn: notifications_fetchAll,
    select: countUrgentUnread,
    refetchInterval: URGENT_POLL_INTERVAL_MS,
  })
