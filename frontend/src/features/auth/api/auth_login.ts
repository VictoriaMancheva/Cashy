import type { AuthResponse, LoginFormValues } from '@/features/auth/consts/auth_schemas'
import { AuthResponseSchema } from '@/features/auth/consts/auth_schemas'
import { AUTH_ENDPOINTS } from '@/features/auth/consts/auth_endpoints'
import { apiClient } from '@/api/client'

export const auth_login = (data: LoginFormValues): Promise<AuthResponse> =>
  apiClient
    .post<unknown>(AUTH_ENDPOINTS.login, data)
    .then((res) => AuthResponseSchema.parse(res.data))
