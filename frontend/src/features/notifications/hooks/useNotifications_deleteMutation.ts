import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { notifications_delete } from '@/features/notifications/api/notifications_delete'
import { notificationKeys } from '@/features/notifications/apiKeys'

export const useNotifications_deleteMutation = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notifications_delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all() })
    },
  })
}
