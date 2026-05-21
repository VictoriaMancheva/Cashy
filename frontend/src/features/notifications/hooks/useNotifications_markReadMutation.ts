import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { notifications_markRead } from '@/features/notifications/api/notifications_markRead'
import { notificationKeys } from '@/features/notifications/apiKeys'
import type { Notification } from '@/features/notifications/consts/notifications_schemas'

export const useNotifications_markReadMutation = (): UseMutationResult<Notification, Error, number> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notifications_markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all() })
    },
  })
}
