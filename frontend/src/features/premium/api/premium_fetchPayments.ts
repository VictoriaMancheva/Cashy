import { z } from 'zod'

import { apiClient } from '@/api/client'
import { PREMIUM_ENDPOINTS } from '@/features/premium/consts/premium_endpoints'
import type { Payment } from '@/features/premium/consts/premium_schemas'
import { PaymentSchema } from '@/features/premium/consts/premium_schemas'

export const premium_fetchPayments = (): Promise<Payment[]> =>
  apiClient
    .get<unknown>(PREMIUM_ENDPOINTS.payments)
    .then((res) => z.array(PaymentSchema).parse(res.data))
