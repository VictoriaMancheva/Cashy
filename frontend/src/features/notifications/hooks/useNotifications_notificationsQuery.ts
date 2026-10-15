import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { notifications_fetchAll } from '@/features/notifications/api/notifications_fetchAll'
import { notificationKeys } from '@/features/notifications/apiKeys'
import type { Notification } from '@/features/notifications/consts/notifications_schemas'

const isUrgentUnread = (n: Notification): boolean => n.priority === 'URGENT' && !n.isRead

// Unread urgent notifications go to the top; everything else keeps the newest-first order from the API
const urgentUnreadFirst = (notifications: Notification[]): Notification[] =>
  [...notifications].sort((a, b) => Number(isUrgentUnread(b)) - Number(isUrgentUnread(a)))

export const useNotifications_notificationsQuery = (): UseQueryResult<Notification[]> =>
  useQuery({ queryKey: notificationKeys.all(), queryFn: notifications_fetchAll, select: urgentUnreadFirst })
