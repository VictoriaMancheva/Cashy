import { CircleCheck, CircleX, Clock, Loader2 } from 'lucide-react'

import type { Payment } from '@/features/premium/consts/premium_schemas'
import { useTranslation } from '@/i18n/useTranslation'

type Props = {
  hasSessionId: boolean
  isPending: boolean
  payment: Payment | undefined
  errorMessage: string | null
}

export const Premium_ConfirmStatus = ({ hasSessionId, isPending, payment, errorMessage }: Props) => {
  const { t } = useTranslation()

  if (!hasSessionId) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <CircleX className="h-12 w-12 text-destructive" />
        <p className="font-semibold">{t('premium.missingSession')}</p>
      </div>
    )
  }

  if (errorMessage != null) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <CircleX className="h-12 w-12 text-destructive" />
        <p className="font-semibold">{t('premium.confirmFailed')}</p>
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
      </div>
    )
  }

  if (isPending || payment == null) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        <p className="font-semibold">{t('premium.confirming')}</p>
      </div>
    )
  }

  if (payment.status !== 'PAID') {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <Clock className="h-12 w-12 text-amber-500" />
        <p className="font-semibold">{t('premium.processing')}</p>
        <p className="text-sm text-muted-foreground">{t('premium.processingDescription')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <CircleCheck className="h-12 w-12 text-primary" />
      <p className="text-lg font-semibold">{t('premium.welcome')}</p>
      <p className="text-sm text-muted-foreground">{t('premium.welcomeDescription')}</p>
    </div>
  )
}
