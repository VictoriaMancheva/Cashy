import { useMutation } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'

import { premium_createCheckoutSession } from '@/features/premium/api/premium_createCheckoutSession'
import type { CheckoutSession } from '@/features/premium/consts/premium_schemas'

// Redirects the browser to the Stripe-hosted payment page
export const usePremium_checkoutMutation = (): UseMutationResult<CheckoutSession, Error, void> =>
  useMutation({
    mutationFn: premium_createCheckoutSession,
    onSuccess: (session) => {
      window.location.assign(session.url)
    },
  })
