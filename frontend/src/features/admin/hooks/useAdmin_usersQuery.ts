import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { admin_fetchUsers } from '@/features/admin/api/admin_fetchUsers'
import { adminKeys } from '@/features/admin/apiKeys'
import type { AdminUser } from '@/features/admin/consts/admin_schemas'

export const useAdmin_usersQuery = (): UseQueryResult<AdminUser[]> =>
  useQuery({ queryKey: adminKeys.users(), queryFn: admin_fetchUsers })
