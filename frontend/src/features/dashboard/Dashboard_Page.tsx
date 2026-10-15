import { ArrowDownCircle, ArrowUpCircle, TrendingUp } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DailyBudget_TodayCard } from '@/features/dailyBudget/components/DailyBudget_TodayCard'
import { useDashboard_summaryQuery } from '@/features/dashboard/hooks/useDashboard_summaryQuery'
import { useTranslation } from '@/i18n/useTranslation'
import { AppLayout } from '@/layouts/AppLayout'
import { formatCurrency, formatDate } from '@/utils/formatters'

export const Dashboard_Page = () => {
  const { data: summary } = useDashboard_summaryQuery()
  const { t } = useTranslation()

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('dashboard.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DailyBudget_TodayCard compact />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.netBalance')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${(summary?.netBalance ?? 0) >= 0 ? 'text-foreground' : 'text-destructive'}`}>
                {formatCurrency(summary?.netBalance ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{t('dashboard.allTime')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 text-green-500" />
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.totalIncome')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(summary?.totalIncome ?? 0)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('dashboard.thisMonth', { amount: formatCurrency(summary?.currentMonthIncome ?? 0) })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <ArrowDownCircle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.totalExpenses')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(summary?.totalExpenses ?? 0)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('dashboard.thisMonth', { amount: formatCurrency(summary?.currentMonthExpenses ?? 0) })}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('dashboard.recentTransactions')}</CardTitle>
          </CardHeader>
          <CardContent>
            {summary == null || summary.recentTransactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{t('dashboard.noTransactions')}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('common.description')}</TableHead>
                    <TableHead>{t('common.category')}</TableHead>
                    <TableHead>{t('common.type')}</TableHead>
                    <TableHead className="text-right">{t('common.amount')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.recentTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-muted-foreground">{formatDate(tx.date)}</TableCell>
                      <TableCell>{tx.description ?? '—'}</TableCell>
                      <TableCell>{tx.categoryName ?? '—'}</TableCell>
                      <TableCell>
                        <Badge variant={tx.type === 'INCOME' ? 'default' : 'destructive'}>
                          {t(`transactionType.${tx.type}` as const)}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${tx.type === 'INCOME' ? 'text-green-600' : 'text-destructive'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
