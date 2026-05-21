import { useState } from 'react'

import { PieChart, Pencil, Trash2 } from 'lucide-react'

import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Budgets_Form } from '@/features/budgets/components/Budgets_Form'
import type { Budget } from '@/features/budgets/consts/budgets_schemas'
import { useBudgets_budgetsQuery } from '@/features/budgets/hooks/useBudgets_budgetsQuery'
import { useBudgets_deleteMutation } from '@/features/budgets/hooks/useBudgets_deleteMutation'
import { AppLayout } from '@/layouts/AppLayout'
import { formatCurrency } from '@/utils/formatters'
import { MONTHS } from '@/utils/formatters'

export const Budgets_Page = () => {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Budget | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: budgets } = useBudgets_budgetsQuery()
  const deleteMutation = useBudgets_deleteMutation()

  const handleNew = () => {
    setEditing(null)
    setOpen(true)
  }

  const handleEdit = (budget: Budget) => {
    setEditing(budget)
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

  const monthLabel = (month: number) => MONTHS.find((m) => m.value === month)?.label ?? String(month)

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Budgets</h1>
          <Button onClick={handleNew}>New Budget</Button>
        </div>

        {budgets == null || budgets.length === 0 ? (
          <EmptyState
            icon={PieChart}
            title="No budgets yet"
            description="Create a budget to track your monthly spending."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget) => (
              <Card key={budget.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">
                      {monthLabel(budget.month)} {budget.year}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(budget)}
                        aria-label="Edit budget"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(budget.id)}
                        aria-label="Delete budget"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(budget.totalAmount)}
                  </p>
                  {budget.categories.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-border">
                      {budget.categories.map((cat) => (
                        <div key={cat.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{cat.categoryName}</span>
                          <span>{formatCurrency(cat.limitAmount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing != null ? 'Edit Budget' : 'New Budget'}</DialogTitle>
            </DialogHeader>
            <Budgets_Form
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
          title="Delete budget"
          description="This action cannot be undone. The budget will be permanently removed."
        />
      </div>
    </AppLayout>
  )
}
