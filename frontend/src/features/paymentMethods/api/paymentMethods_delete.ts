import { apiClient } from '@/api/client'
import { PAYMENT_METHODS_ENDPOINTS } from '@/features/paymentMethods/consts/paymentMethods_endpoints'

export const paymentMethods_delete = (id: number): Promise<void> =>
  apiClient.delete(PAYMENT_METHODS_ENDPOINTS.byId(id)).then(() => undefined)
