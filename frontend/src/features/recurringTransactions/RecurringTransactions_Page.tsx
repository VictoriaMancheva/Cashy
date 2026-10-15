import { useState } from 'react'

import { Pencil, Play, RefreshCw, Trash2 } from 'lucide-react'

import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PaginationControls } from '@/components/ui/PaginationControls'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { RecurringTransaction } from '@/features/recurringTransactions/consts/recurringTransactions_schemas'
import { useRecurringTransactions_applyMutation } from '@/features/recurringTransactions/hooks/useRecurringTransactions_applyMutation'
import { useRecurringTransactions_deleteMutation } from '@/features/recurringTransactions/hooks/useRecurringTransactions_deleteMutation'
import { useRecurringTransactions_recurringTransactionsQuery } from '@/features/recurringTransactions/hooks/useRecurringTransactions_recurringTransactionsQuery'
import { RecurringTransactions_Form } from '@/features/recurringTransactions/components/RecurringTransactions_Form'
import { DEFAULT_PAGE_SIZE, usePagination } from '@/hooks/usePagination'
import { useTranslation } from '@/i18n/useTranslation'
import { AppLayout } from '@/layouts/AppLayout'
import { formatCurrency, formatDate } from '@/utils/formatters'

export const RecurringTransactions_Page = () => {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<RecurringTransaction | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: recurringTransactions } = useRecurringTransactions_recurringTransactionsQuery()
  const deleteMutation = useRecurringTransactions_deleteMutation()
  const applyMutation = useRecurringTransactions_applyMutation()
  const { t } = useTranslation()
  const { page, setPage, totalPages, pageItems } = usePagination(recurringTransactions, DEFAULT_PAGE_SIZE)

  const handleNew = () => {
    setEditing(null)
    setOpen(true)
  }

  const handleEdit = (rt: RecurringTransaction) => {
    setEditing(rt)
    setOpen(true)
  }

  const handleFormSuccess = () => {
    setOpen(false)
    setEditing(null)
  }

  const handleDeleteConfirm = () => {
    if (deletingId == null) return
    deleteMutation.mutate(deletingId, { onSuccess: () => setDeletingId(null) })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t('recurring.title')}</h1>
          <Button onClick={handleNew}>{t('recurring.new')}</Button>
        </div>

        {recurringTransactions == null || recurringTransactions.length === 0 ? (
          <EmptyState
            icon={RefreshCw}
            title={t('recurring.emptyTitle')}
            description={t('recurring.emptyDescription')}
          />
        ) : (
          <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.description')}</TableHead>
                <TableHead>{t('common.type')}</TableHead>
                <TableHead>{t('common.amount')}</TableHead>
                <TableHead>{t('recurring.frequency')}</TableHead>
                <TableHead>{t('recurring.nextDate')}</TableHead>
                <TableHead>{t('common.category')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((rt) => (
                <TableRow key={rt.id}>
                  <TableCell>{rt.description ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant={rt.type === 'INCOME' ? 'income' : 'expense'}>{t(`transactionType.${rt.type}` as const)}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(rt.amount)}</TableCell>
                  <TableCell>{t(`frequency.${rt.frequency}` as const)}</TableCell>
                  <TableCell>{formatDate(rt.nextDate)}</TableCell>
                  <TableCell>{rt.categoryName ?? '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => applyMutation.mutate(rt.id)}
                        disabled={applyMutation.isPending}
                        aria-label={t('recurring.applyAria')}
                      >
                        <Play className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(rt)}
                        aria-label={t('recurring.editAria')}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(rt.id)}
                        aria-label={t('recurring.deleteAria')}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing != null ? t('recurring.edit') : t('recurring.newTitle')}</DialogTitle>
            </DialogHeader>
            <RecurringTransactions_Form
              key={editing?.id ?? 'new'}
              defaultValues={editing}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>

        <DeleteConfirmDialog
          open={deletingId != null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setDeletingId(null)
          }}
          onConfirm={handleDeleteConfirm}
          isPending={deleteMutation.isPending}
          title={t('recurring.deleteTitle')}
          description={t('recurring.deleteDescription')}
        />
      </div>
    </AppLayout>
  )
}
