import { apiClient } from '@/api/client'
import { PREMIUM_ENDPOINTS } from '@/features/premium/consts/premium_endpoints'
import type { CheckoutSession } from '@/features/premium/consts/premium_schemas'
import { CheckoutSessionSchema } from '@/features/premium/consts/premium_schemas'

export const premium_createCheckoutSession = (): Promise<CheckoutSession> =>
  apiClient
    .post<unknown>(PREMIUM_ENDPOINTS.checkoutSession)
    .then((res) => CheckoutSessionSchema.parse(res.data))
