import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

import { premium_fetchPayments } from '@/features/premium/api/premium_fetchPayments'
import { premiumKeys } from '@/features/premium/apiKeys'
import type { Payment } from '@/features/premium/consts/premium_schemas'

export const usePremium_paymentsQuery = (): UseQueryResult<Payment[]> =>
  useQuery({ queryKey: premiumKeys.payments(), queryFn: premium_fetchPayments })
