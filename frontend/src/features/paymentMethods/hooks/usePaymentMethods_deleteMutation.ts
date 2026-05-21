import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { paymentMethods_delete } from '@/features/paymentMethods/api/paymentMethods_delete'
import { paymentMethodKeys } from '@/features/paymentMethods/apiKeys'

export const usePaymentMethods_deleteMutation = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: paymentMethods_delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all() })
    },
  })
}
