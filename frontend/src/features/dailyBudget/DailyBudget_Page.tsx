import { useState } from 'react'

import { CalendarDays, Trash2 } from 'lucide-react'

import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaginationControls } from '@/components/ui/PaginationControls'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DailyBudget_Form } from '@/features/dailyBudget/components/DailyBudget_Form'
import { DailyBudget_TodayCard } from '@/features/dailyBudget/components/DailyBudget_TodayCard'
import { useDailyBudget_dailyBudgetsQuery } from '@/features/dailyBudget/hooks/useDailyBudget_dailyBudgetsQuery'
import { useDailyBudget_deleteMutation } from '@/features/dailyBudget/hooks/useDailyBudget_deleteMutation'
import { DEFAULT_PAGE_SIZE, usePagination } from '@/hooks/usePagination'
import { useTranslation } from '@/i18n/useTranslation'
import { AppLayout } from '@/layouts/AppLayout'
import { formatCurrency, formatDate } from '@/utils/formatters'

export const DailyBudget_Page = () => {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { t } = useTranslation()

  const { data: dailyBudgets } = useDailyBudget_dailyBudgetsQuery()
  const deleteMutation = useDailyBudget_deleteMutation()
  const { page, setPage, totalPages, pageItems } = usePagination(dailyBudgets, DEFAULT_PAGE_SIZE)

  const handleDeleteConfirm = () => {
    if (deletingId == null) return
    deleteMutation.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
    })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('dailyBudget.title')}</h1>

        <DailyBudget_TodayCard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{t('dailyBudget.setTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <DailyBudget_Form onSuccess={() => undefined} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('dailyBudget.listTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {dailyBudgets == null || dailyBudgets.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title={t('dailyBudget.emptyTitle')}
                  description={t('dailyBudget.emptyDescription')}
                />
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('common.date')}</TableHead>
                        <TableHead>{t('dailyBudget.limit')}</TableHead>
                        <TableHead className="w-16 text-right">{t('common.delete')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageItems.map((budget) => (
                        <TableRow key={budget.id}>
                          <TableCell>{formatDate(budget.date)}</TableCell>
                          <TableCell>{formatCurrency(budget.dailyLimit)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingId(budget.id)}
                              aria-label={t('dailyBudget.deleteAria', { date: formatDate(budget.date) })}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="pb-4">
                    <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <DeleteConfirmDialog
          open={deletingId != null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setDeletingId(null)
          }}
          onConfirm={handleDeleteConfirm}
          isPending={deleteMutation.isPending}
          title={t('dailyBudget.deleteTitle')}
          description={t('dailyBudget.deleteDescription')}
        />
      </div>
    </AppLayout>
  )
}
