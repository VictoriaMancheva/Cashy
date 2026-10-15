import { Coins } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { isCurrency, CURRENCIES } from '@/i18n/currencies'
import { useCurrency } from '@/i18n/useCurrency'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

export const CurrencySwitcher = ({ className }: Props) => {
  const { currency, setCurrency } = useCurrency()
  const { t } = useTranslation()

  return (
    <Select
      value={currency}
      onValueChange={(value) => {
        if (isCurrency(value)) setCurrency(value)
      }}
    >
      <SelectTrigger className={cn('h-9', className)} aria-label={t('common.currency')}>
        <div className="flex items-center gap-2 min-w-0">
          <Coins className="h-4 w-4 shrink-0 text-muted-foreground" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((option) => (
          <SelectItem key={option.code} value={option.code}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
