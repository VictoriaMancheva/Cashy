import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { premium_confirmPayment } from '@/features/premium/api/premium_confirmPayment'
import { premiumKeys } from '@/features/premium/apiKeys'
import type { Payment } from '@/features/premium/consts/premium_schemas'
import { profileKeys } from '@/features/profile/apiKeys'

export const usePremium_confirmPaymentMutation = (): UseMutationResult<Payment, Error, string> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: premium_confirmPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() })
      queryClient.invalidateQueries({ queryKey: premiumKeys.payments() })
    },
  })
}
