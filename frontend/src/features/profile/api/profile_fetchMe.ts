import { apiClient } from '@/api/client'
import { PROFILE_ENDPOINTS } from '@/features/profile/consts/profile_endpoints'
import type { User } from '@/features/profile/consts/profile_schemas'
import { UserSchema } from '@/features/profile/consts/profile_schemas'

export const profile_fetchMe = (): Promise<User> =>
  apiClient
    .get<unknown>(PROFILE_ENDPOINTS.me)
    .then((res) => UserSchema.parse(res.data))
