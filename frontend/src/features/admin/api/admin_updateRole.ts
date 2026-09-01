import { apiClient } from '@/api/client'
import { ADMIN_ENDPOINTS } from '@/features/admin/consts/admin_endpoints'
import { AdminUserSchema } from '@/features/admin/consts/admin_schemas'
import type { AdminUser } from '@/features/admin/consts/admin_schemas'

type UpdateRoleParams = {
  id: number
  role: 'USER' | 'PREMIUM' | 'ADMIN'
}

export const admin_updateRole = ({ id, role }: UpdateRoleParams): Promise<AdminUser> =>
  apiClient
    .patch<unknown>(ADMIN_ENDPOINTS.userRole(id), { role })
    .then((res) => AdminUserSchema.parse(res.data))
