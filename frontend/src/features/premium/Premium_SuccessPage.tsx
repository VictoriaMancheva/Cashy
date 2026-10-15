import { useEffect, useRef } from 'react'

import { Link, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Premium_ConfirmStatus } from '@/features/premium/components/Premium_ConfirmStatus'
import { PREMIUM_SESSION_ID_PARAM } from '@/features/premium/consts/premium_constants'
import { usePremium_confirmPaymentMutation } from '@/features/premium/hooks/usePremium_confirmPaymentMutation'
import { useTranslation } from '@/i18n/useTranslation'
import { AppLayout } from '@/layouts/AppLayout'
import { ROUTES } from '@/routes'
import { getApiErrorMessage } from '@/utils/errors'

export const Premium_SuccessPage = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get(PREMIUM_SESSION_ID_PARAM)
  const { mutate: confirmPayment, data: payment, isPending, error } = usePremium_confirmPaymentMutation()
  const confirmedSessionRef = useRef<string | null>(null)

  // The ref keeps React StrictMode from confirming the same session twice
  useEffect(() => {
    if (sessionId == null || confirmedSessionRef.current === sessionId) return
    confirmedSessionRef.current = sessionId
    confirmPayment(sessionId)
  }, [sessionId, confirmPayment])

  const errorMessage = error != null ? getApiErrorMessage(error, t('premium.somethingWrong')) : null

  return (
    <AppLayout>
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="space-y-6 py-10">
            <Premium_ConfirmStatus
              hasSessionId={sessionId != null}
              isPending={isPending}
              payment={payment}
              errorMessage={errorMessage}
            />
            <div className="flex justify-center gap-2">
              <Button asChild variant="outline">
                <Link to={ROUTES.premium}>{t('premium.backToPremium')}</Link>
              </Button>
              <Button asChild>
                <Link to={ROUTES.dashboard}>{t('premium.goToDashboard')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
