import { z } from 'zod'

import { apiClient } from '@/api/client'
import { ADMIN_ENDPOINTS } from '@/features/admin/consts/admin_endpoints'
import { AdminUserSchema } from '@/features/admin/consts/admin_schemas'
import type { AdminUser } from '@/features/admin/consts/admin_schemas'

export const admin_fetchUsers = (): Promise<AdminUser[]> =>
  apiClient
    .get<unknown>(ADMIN_ENDPOINTS.users)
    .then((res) => z.array(AdminUserSchema).parse(res.data))
