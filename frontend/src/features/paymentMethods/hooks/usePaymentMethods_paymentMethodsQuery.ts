import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { paymentMethods_fetchAll } from '@/features/paymentMethods/api/paymentMethods_fetchAll'
import { paymentMethodKeys } from '@/features/paymentMethods/apiKeys'
import type { PaymentMethod } from '@/features/paymentMethods/consts/paymentMethods_schemas'

export const usePaymentMethods_paymentMethodsQuery = (): UseQueryResult<PaymentMethod[]> =>
  useQuery({
    queryKey: paymentMethodKeys.all(),
    queryFn: paymentMethods_fetchAll,
  })
