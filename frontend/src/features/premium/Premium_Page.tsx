import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Premium_PaymentsTable } from '@/features/premium/components/Premium_PaymentsTable'
import { Premium_PlanCard } from '@/features/premium/components/Premium_PlanCard'
import { usePremium_checkoutMutation } from '@/features/premium/hooks/usePremium_checkoutMutation'
import { usePremium_paymentsQuery } from '@/features/premium/hooks/usePremium_paymentsQuery'
import { useProfile_meQuery } from '@/features/profile/hooks/useProfile_meQuery'
import { useTranslation } from '@/i18n/useTranslation'
import { AppLayout } from '@/layouts/AppLayout'
import { getApiErrorMessage } from '@/utils/errors'

export const Premium_Page = () => {
  const { t } = useTranslation()
  const { data: user } = useProfile_meQuery()
  const { data: payments } = usePremium_paymentsQuery()
  const { mutate: startCheckout, isPending, error } = usePremium_checkoutMutation()

  const hasPremium = user?.role === 'PREMIUM' || user?.role === 'ADMIN'
  const errorMessage = error != null ? getApiErrorMessage(error, t('premium.startFailed')) : null

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">{t('premium.title')}</h1>

        <Premium_PlanCard
          hasPremium={hasPremium}
          isPending={isPending}
          errorMessage={errorMessage}
          onUpgrade={() => startCheckout()}
        />

        <Card>
          <CardHeader>
            <CardTitle>{t('premium.paymentHistory')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Premium_PaymentsTable payments={payments ?? []} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
