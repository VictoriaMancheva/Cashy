import { apiClient } from '@/api/client'
import { PROFILE_ENDPOINTS } from '@/features/profile/consts/profile_endpoints'
import type { User, UsernameFormValues } from '@/features/profile/consts/profile_schemas'
import { UserSchema } from '@/features/profile/consts/profile_schemas'

export const profile_updateUsername = (data: UsernameFormValues): Promise<User> =>
  apiClient
    .patch<unknown>(PROFILE_ENDPOINTS.updateUsername, data)
    .then((res) => UserSchema.parse(res.data))
