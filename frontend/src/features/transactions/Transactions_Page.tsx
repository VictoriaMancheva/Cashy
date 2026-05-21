import { useState } from 'react'

import { ArrowLeftRight, Pencil, Trash2 } from 'lucide-react'

import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Transactions_Form } from '@/features/transactions/components/Transactions_Form'
import type { Transaction } from '@/features/transactions/consts/transactions_schemas'
import { useTransactions_deleteMutation } from '@/features/transactions/hooks/useTransactions_deleteMutation'
import { useTransactions_transactionsQuery } from '@/features/transactions/hooks/useTransactions_transactionsQuery'
import { AppLayout } from '@/layouts/AppLayout'
import { formatCurrency, formatDate } from '@/utils/formatters'

export const Transactions_Page = () => {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: transactions } = useTransactions_transactionsQuery()
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

  const renderTable = (rows: Transaction[] | undefined) => {
    if (rows == null || rows.length === 0) {
      return (
        <EmptyState
          icon={ArrowLeftRight}
          title="No transactions"
          description="Add your first transaction to start tracking."
        />
      )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>{formatDate(tx.date)}</TableCell>
              <TableCell>
                <Badge variant={tx.type === 'INCOME' ? 'income' : 'expense'}>{tx.type}</Badge>
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
                    aria-label={`Edit transaction`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(tx.id)}
                    aria-label={`Delete transaction`}
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

  const income = transactions?.filter((t) => t.type === 'INCOME')
  const expenses = transactions?.filter((t) => t.type === 'EXPENSE')

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <Button onClick={handleNew}>New Transaction</Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            {renderTable(transactions)}
          </TabsContent>
          <TabsContent value="income" className="mt-4">
            {renderTable(income)}
          </TabsContent>
          <TabsContent value="expenses" className="mt-4">
            {renderTable(expenses)}
          </TabsContent>
        </Tabs>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing != null ? 'Edit Transaction' : 'New Transaction'}</DialogTitle>
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
          title="Delete transaction"
          description="This action cannot be undone. The transaction will be permanently removed."
        />
      </div>
    </AppLayout>
  )
}
