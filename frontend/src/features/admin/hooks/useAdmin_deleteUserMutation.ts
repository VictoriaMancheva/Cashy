import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { admin_deleteUser } from '@/features/admin/api/admin_deleteUser'
import { adminKeys } from '@/features/admin/apiKeys'

export const useAdmin_deleteUserMutation = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: admin_deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
    },
  })
}
