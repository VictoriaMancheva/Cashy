import { apiClient } from '@/api/client'
import { PROFILE_ENDPOINTS } from '@/features/profile/consts/profile_endpoints'

export const profile_updatePassword = (data: {
  currentPassword: string
  newPassword: string
}): Promise<void> =>
  apiClient.patch(PROFILE_ENDPOINTS.updatePassword, data).then(() => undefined)
