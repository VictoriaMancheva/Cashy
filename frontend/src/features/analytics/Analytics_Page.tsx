import { useState } from 'react'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PremiumGate } from '@/components/common/PremiumGate'
import { useAnalytics_byCategoryQuery } from '@/features/analytics/hooks/useAnalytics_byCategoryQuery'
import { useAnalytics_forecastQuery } from '@/features/analytics/hooks/useAnalytics_forecastQuery'
import { useAnalytics_monthlyQuery } from '@/features/analytics/hooks/useAnalytics_monthlyQuery'
import { useTranslation } from '@/i18n/useTranslation'
import { AppLayout } from '@/layouts/AppLayout'
import { formatCurrencyShort, formatMonth, MONTHS } from '@/utils/formatters'

const PALETTE = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16',
]

export const Analytics_Page = () => {
  const { t } = useTranslation()
  const today = new Date()
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())

  const { data: monthly } = useAnalytics_monthlyQuery()
  const { data: byCategory } = useAnalytics_byCategoryQuery(selectedMonth, selectedYear)
  const { data: forecast } = useAnalytics_forecastQuery()

  const chartData = (monthly ?? []).map((row) => ({
    name: formatMonth(row.month, 'short'),
    income: row.income,
    expenses: row.expenses,
  }))

  const pieData = (byCategory ?? []).map((row) => ({
    name: row.categoryName,
    value: row.amount,
  }))

  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i)

  const forecastMonthLabel = forecast
    ? `${formatMonth(forecast.forecastMonth)} ${forecast.forecastYear}`
    : null

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('analytics.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('analytics.subtitle')}</p>
        </div>

        <PremiumGate>
          {forecast && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {t('analytics.forecastFor', { month: forecastMonthLabel ?? '' })}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {t('analytics.forecastDescription')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t('analytics.projectedIncome')}</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {formatCurrencyShort(forecast.forecastIncome)}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t('analytics.projectedExpenses')}</p>
                    <p className="text-lg font-semibold text-red-500">
                      {formatCurrencyShort(forecast.forecastExpenses)}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t('analytics.projectedNet')}</p>
                    <p className={`text-lg font-semibold ${forecast.forecastNet >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {formatCurrencyShort(forecast.forecastNet)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </PremiumGate>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('analytics.monthlyTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t('common.noData')}</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 12 }} width={70} />
                  <Tooltip formatter={(value) => formatCurrencyShort(Number(value))} />
                  <Legend />
                  <Bar dataKey="income" name={t('analytics.income')} fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name={t('analytics.expenses')} fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="text-base">{t('analytics.byCategoryTitle')}</CardTitle>
              <div className="flex gap-2">
                <Select
                  value={String(selectedMonth)}
                  onValueChange={(v) => setSelectedMonth(Number(v))}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m} value={String(m)}>
                        {formatMonth(m)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={String(selectedYear)}
                  onValueChange={(v) => setSelectedYear(Number(v))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t('analytics.noExpenseData')}</p>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-6">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={PALETTE[index % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrencyShort(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="shrink-0 space-y-2 text-sm min-w-40">
                  {pieData.map((entry, index) => (
                    <li key={entry.name} className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
                      />
                      <span className="text-muted-foreground truncate">{entry.name}</span>
                      <span className="ml-auto font-medium">{formatCurrencyShort(entry.value)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
