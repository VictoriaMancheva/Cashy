import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { paymentMethods_create } from '@/features/paymentMethods/api/paymentMethods_create'
import { paymentMethodKeys } from '@/features/paymentMethods/apiKeys'
import type { PaymentMethod, PaymentMethodFormValues } from '@/features/paymentMethods/consts/paymentMethods_schemas'

export const usePaymentMethods_createMutation = (): UseMutationResult<PaymentMethod, Error, PaymentMethodFormValues> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: paymentMethods_create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all() })
    },
  })
}
