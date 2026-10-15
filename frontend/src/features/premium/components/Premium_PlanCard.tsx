import { Check, Crown, Loader2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PREMIUM_CURRENCY, PREMIUM_FEATURE_KEYS, PREMIUM_PRICE } from '@/features/premium/consts/premium_constants'
import { useTranslation } from '@/i18n/useTranslation'
import { formatMoney } from '@/utils/formatters'

type Props = {
  hasPremium: boolean
  isPending: boolean
  errorMessage: string | null
  onUpgrade: () => void
}

export const Premium_PlanCard = ({ hasPremium, isPending, errorMessage, onUpgrade }: Props) => {
  const { t } = useTranslation()

  return (
    <Card className="border-amber-200">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            {t('premium.planName')}
          </CardTitle>
          {hasPremium && <Badge>{t('premium.active')}</Badge>}
        </div>
        <CardDescription>
          <span className="text-2xl font-bold text-foreground">{formatMoney(PREMIUM_PRICE, PREMIUM_CURRENCY)}</span>{' '}
          {t('premium.oneTime')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm">
          {PREMIUM_FEATURE_KEYS.map((featureKey) => (
            <li key={featureKey} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              {t(featureKey)}
            </li>
          ))}
        </ul>
        {!hasPremium && (
          <Button className="w-full" onClick={onUpgrade} disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('premium.upgrade')}
          </Button>
        )}
        {hasPremium && <p className="text-sm text-muted-foreground">{t('premium.alreadyPremium')}</p>}
        {errorMessage != null && <p className="text-sm text-destructive">{errorMessage}</p>}
      </CardContent>
    </Card>
  )
}
