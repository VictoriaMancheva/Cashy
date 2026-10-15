import { useState } from 'react'

import { ArrowLeftRight, Pencil, Trash2 } from 'lucide-react'

import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Transactions_FiltersBar } from '@/features/transactions/components/Transactions_FiltersBar'
import { Transactions_Form } from '@/features/transactions/components/Transactions_Form'
import { DEFAULT_TRANSACTION_FILTERS, TRANSACTION_FILTER_DEBOUNCE_MS } from '@/features/transactions/consts/transactions_constants'
import type { Transaction, TransactionFilters } from '@/features/transactions/consts/transactions_schemas'
import { useTransactions_deleteMutation } from '@/features/transactions/hooks/useTransactions_deleteMutation'
import { useTransactions_transactionsQuery } from '@/features/transactions/hooks/useTransactions_transactionsQuery'
import { useDebounce } from '@/hooks/useDebounce'
import { useTranslation } from '@/i18n/useTranslation'
import { AppLayout } from '@/layouts/AppLayout'
import { formatCurrency, formatDate } from '@/utils/formatters'

type ActiveTab = '' | 'INCOME' | 'EXPENSE'

const TAB_ALL = ''
const TAB_INCOME = 'INCOME'
const TAB_EXPENSE = 'EXPENSE'

export const Transactions_Page = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_TRANSACTION_FILTERS)
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, TRANSACTION_FILTER_DEBOUNCE_MS)

  const effectiveFilters: TransactionFilters = { ...filters, search: debouncedSearch }

  const { data: transactions } = useTransactions_transactionsQuery(effectiveFilters)
  const deleteMutation = useTransactions_deleteMutation()

  const handleNew = () => {
    setEditing(null)
    setOpen(true)
  }

  const handleEdit = (tx: Transaction) => {
    setEditing(tx)
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

  const handleTabChange = (value: string) => {
    setFilters((prev) => ({ ...prev, type: value as ActiveTab }))
  }

  const handleFiltersChange = (next: TransactionFilters) => {
    setFilters(next)
    if (next.search !== filters.search) {
      setSearchInput(next.search)
    }
  }

  const renderTable = (rows: Transaction[] | undefined) => {
    if (rows == null || rows.length === 0) {
      return (
        <EmptyState
          icon={ArrowLeftRight}
          title={t('transactions.emptyTitle')}
          description={t('transactions.emptyDescription')}
        />
      )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('common.date')}</TableHead>
            <TableHead>{t('common.type')}</TableHead>
            <TableHead>{t('common.amount')}</TableHead>
            <TableHead>{t('common.description')}</TableHead>
            <TableHead>{t('common.category')}</TableHead>
            <TableHead>{t('common.paymentMethod')}</TableHead>
            <TableHead className="w-24 text-right">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>{formatDate(tx.date)}</TableCell>
              <TableCell>
                <Badge variant={tx.type === 'INCOME' ? 'income' : 'expense'}>{t(`transactionType.${tx.type}` as const)}</Badge>
              </TableCell>
              <TableCell>{formatCurrency(tx.amount)}</TableCell>
              <TableCell>{tx.description ?? '—'}</TableCell>
              <TableCell>{tx.categoryName ?? '—'}</TableCell>
              <TableCell>{tx.paymentMethodName ?? '—'}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(tx)}
                    aria-label={t('transactions.editAria')}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(tx.id)}
                    aria-label={t('transactions.deleteAria')}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t('transactions.title')}</h1>
          <Button onClick={handleNew}>{t('transactions.new')}</Button>
        </div>

        <Transactions_FiltersBar
          filters={effectiveFilters}
          onChange={handleFiltersChange}
          searchInput={searchInput}
          onSearchInput={setSearchInput}
        />

        <Tabs value={filters.type} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value={TAB_ALL}>{t('transactions.all')}</TabsTrigger>
            <TabsTrigger value={TAB_INCOME}>{t('transactions.incomeTab')}</TabsTrigger>
            <TabsTrigger value={TAB_EXPENSE}>{t('transactions.expensesTab')}</TabsTrigger>
          </TabsList>
          <TabsContent value={TAB_ALL} className="mt-4">{renderTable(transactions)}</TabsContent>
          <TabsContent value={TAB_INCOME} className="mt-4">{renderTable(transactions)}</TabsContent>
          <TabsContent value={TAB_EXPENSE} className="mt-4">{renderTable(transactions)}</TabsContent>
        </Tabs>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing != null ? t('transactions.edit') : t('transactions.new')}</DialogTitle>
            </DialogHeader>
            <Transactions_Form
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
          title={t('transactions.deleteTitle')}
          description={t('transactions.deleteDescription')}
        />
      </div>
    </AppLayout>
  )
}
