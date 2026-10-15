import { CalendarDays } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useDailyBudget_todayQuery } from '@/features/dailyBudget/hooks/useDailyBudget_todayQuery'
import { useTranslation } from '@/i18n/useTranslation'
import { formatCurrency } from '@/utils/formatters'

const MAX_PERCENT = 100
const WARN_PERCENT = 80

type Props = {
  compact?: boolean
}

export const DailyBudget_TodayCard = ({ compact = false }: Props) => {
  const { data: today } = useDailyBudget_todayQuery()
  const { t } = useTranslation()

  if (today == null || today.source === 'NONE') {
    return null
  }

  const limit = today.dailyLimit ?? 0
  const spent = today.spentToday
  const remaining = today.remainingToday ?? 0
  const percent = limit > 0 ? Math.min((spent / limit) * MAX_PERCENT, MAX_PERCENT) : 0
  const isOver = remaining < 0

  const sourceLabel = today.source === 'MANUAL' ? t('dailyBudget.manualLimit') : t('dailyBudget.autoCalculated')

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('dailyBudget.todaysBudget')}</CardTitle>
            </div>
            <Badge variant={today.source === 'MANUAL' ? 'default' : 'secondary'} className="text-xs">
              {sourceLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('dailyBudget.spent')}</span>
            <span className={isOver ? 'text-destructive font-medium' : 'font-medium'}>
              {formatCurrency(spent)} / {formatCurrency(limit)}
            </span>
          </div>
          <Progress value={percent} className={percent >= WARN_PERCENT ? '[&>div]:bg-destructive' : ''} />
          <p className={`text-xs ${isOver ? 'text-destructive' : 'text-muted-foreground'}`}>
            {isOver
              ? t('dailyBudget.overBy', { amount: formatCurrency(-remaining) })
              : t('dailyBudget.remainingAmount', { amount: formatCurrency(remaining) })}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <CardTitle>{t('dailyBudget.today')}</CardTitle>
          </div>
          <Badge variant={today.source === 'MANUAL' ? 'default' : 'secondary'}>
            {sourceLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{t('dailyBudget.limit')}</p>
            <p className="text-lg font-bold">{formatCurrency(limit)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">{t('dailyBudget.spent')}</p>
            <p className={`text-lg font-bold ${isOver ? 'text-destructive' : ''}`}>{formatCurrency(spent)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">{t('dailyBudget.remaining')}</p>
            <p className={`text-lg font-bold ${isOver ? 'text-destructive' : 'text-green-600'}`}>
              {isOver ? `-${formatCurrency(-remaining)}` : formatCurrency(remaining)}
            </p>
          </div>
        </div>
        <Progress value={percent} className={percent >= WARN_PERCENT ? '[&>div]:bg-destructive' : ''} />
        <p className={`text-sm text-center ${isOver ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
          {isOver
            ? t('dailyBudget.exceededBy', { amount: formatCurrency(-remaining) })
            : t('dailyBudget.percentUsed', { percent: Math.round(percent) })}
        </p>
      </CardContent>
    </Card>
  )
}
