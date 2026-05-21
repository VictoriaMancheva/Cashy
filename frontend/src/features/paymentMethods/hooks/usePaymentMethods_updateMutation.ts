import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { paymentMethods_update } from '@/features/paymentMethods/api/paymentMethods_update'
import { paymentMethodKeys } from '@/features/paymentMethods/apiKeys'
import type { PaymentMethod, PaymentMethodFormValues } from '@/features/paymentMethods/consts/paymentMethods_schemas'

type UpdatePaymentMethodArgs = {
  id: number
  data: PaymentMethodFormValues
}

export const usePaymentMethods_updateMutation = (): UseMutationResult<PaymentMethod, Error, UpdatePaymentMethodArgs> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: paymentMethods_update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all() })
    },
  })
}
