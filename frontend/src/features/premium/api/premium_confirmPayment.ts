import { apiClient } from '@/api/client'
import { PREMIUM_ENDPOINTS } from '@/features/premium/consts/premium_endpoints'
import type { Payment } from '@/features/premium/consts/premium_schemas'
import { PaymentSchema } from '@/features/premium/consts/premium_schemas'

export const premium_confirmPayment = (sessionId: string): Promise<Payment> =>
  apiClient
    .post<unknown>(PREMIUM_ENDPOINTS.confirm, null, { params: { sessionId } })
    .then((res) => PaymentSchema.parse(res.data))
