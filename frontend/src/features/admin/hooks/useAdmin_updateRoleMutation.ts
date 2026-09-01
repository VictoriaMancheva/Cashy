import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { admin_updateRole } from '@/features/admin/api/admin_updateRole'
import { adminKeys } from '@/features/admin/apiKeys'
import type { AdminUser } from '@/features/admin/consts/admin_schemas'

type UpdateRoleParams = {
  id: number
  role: 'USER' | 'PREMIUM' | 'ADMIN'
}

export const useAdmin_updateRoleMutation = (): UseMutationResult<AdminUser, Error, UpdateRoleParams> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: admin_updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
    },
  })
}
