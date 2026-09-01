import { apiClient } from '@/api/client'
import { ADMIN_ENDPOINTS } from '@/features/admin/consts/admin_endpoints'

export const admin_deleteUser = (id: number): Promise<void> =>
  apiClient.delete(ADMIN_ENDPOINTS.deleteUser(id)).then(() => undefined)
