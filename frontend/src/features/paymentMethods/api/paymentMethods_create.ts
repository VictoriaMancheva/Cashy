import { apiClient } from '@/api/client'
import { PAYMENT_METHODS_ENDPOINTS } from '@/features/paymentMethods/consts/paymentMethods_endpoints'
import type { PaymentMethod, PaymentMethodFormValues } from '@/features/paymentMethods/consts/paymentMethods_schemas'
import { PaymentMethodSchema } from '@/features/paymentMethods/consts/paymentMethods_schemas'

export const paymentMethods_create = (data: PaymentMethodFormValues): Promise<PaymentMethod> =>
  apiClient
    .post<unknown>(PAYMENT_METHODS_ENDPOINTS.base, data)
    .then((res) => PaymentMethodSchema.parse(res.data))
