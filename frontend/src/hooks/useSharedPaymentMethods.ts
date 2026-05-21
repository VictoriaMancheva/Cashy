import { useQuery } from '@tanstack/react-query'

import { shared_fetchPaymentMethods } from '@/api/shared'

export const useSharedPaymentMethods = () =>
  useQuery({ queryKey: ['shared', 'paymentMethods'], queryFn: shared_fetchPaymentMethods })
