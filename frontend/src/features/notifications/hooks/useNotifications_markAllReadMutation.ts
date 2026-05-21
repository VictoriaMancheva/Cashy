import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { notifications_markAllRead } from '@/features/notifications/api/notifications_markAllRead'
import { notificationKeys } from '@/features/notifications/apiKeys'

export const useNotifications_markAllReadMutation = (): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notifications_markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all() })
    },
  })
}
