import { z } from 'zod'

import { apiClient } from '@/api/client'
import { PAYMENT_METHODS_ENDPOINTS } from '@/features/paymentMethods/consts/paymentMethods_endpoints'
import type { PaymentMethod } from '@/features/paymentMethods/consts/paymentMethods_schemas'
import { PaymentMethodSchema } from '@/features/paymentMethods/consts/paymentMethods_schemas'

export const paymentMethods_fetchAll = (): Promise<PaymentMethod[]> =>
  apiClient
    .get<unknown>(PAYMENT_METHODS_ENDPOINTS.base)
    .then((res) => z.array(PaymentMethodSchema).parse(res.data))
