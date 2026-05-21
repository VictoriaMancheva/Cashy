import { apiClient } from '@/api/client'
import { PAYMENT_METHODS_ENDPOINTS } from '@/features/paymentMethods/consts/paymentMethods_endpoints'
import type { PaymentMethod, PaymentMethodFormValues } from '@/features/paymentMethods/consts/paymentMethods_schemas'
import { PaymentMethodSchema } from '@/features/paymentMethods/consts/paymentMethods_schemas'

type UpdatePaymentMethodArgs = {
  id: number
  data: PaymentMethodFormValues
}

export const paymentMethods_update = ({ id, data }: UpdatePaymentMethodArgs): Promise<PaymentMethod> =>
  apiClient
    .put<unknown>(PAYMENT_METHODS_ENDPOINTS.byId(id), data)
    .then((res) => PaymentMethodSchema.parse(res.data))
