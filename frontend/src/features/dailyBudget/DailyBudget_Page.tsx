import { useState } from 'react'

import { CalendarDays, Trash2 } from 'lucide-react'

import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DailyBudget_Form } from '@/features/dailyBudget/components/DailyBudget_Form'
import { useDailyBudget_dailyBudgetsQuery } from '@/features/dailyBudget/hooks/useDailyBudget_dailyBudgetsQuery'
import { useDailyBudget_deleteMutation } from '@/features/dailyBudget/hooks/useDailyBudget_deleteMutation'
import { AppLayout } from '@/layouts/AppLayout'
import { formatCurrency, formatDate } from '@/utils/formatters'

export const DailyBudget_Page = () => {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: dailyBudgets } = useDailyBudget_dailyBudgetsQuery()
  const deleteMutation = useDailyBudget_deleteMutation()

  const handleDeleteConfirm = () => {
    if (deletingId == null) return
    deleteMutation.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
    })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Daily Budget</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Set Daily Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <DailyBudget_Form onSuccess={() => undefined} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Daily Budgets</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {dailyBudgets == null || dailyBudgets.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title="No daily budgets yet"
                  description="Set a daily budget above to start tracking your spending limits."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Limit</TableHead>
                      <TableHead className="w-16 text-right">Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyBudgets.map((budget) => (
                      <TableRow key={budget.id}>
                        <TableCell>{formatDate(budget.date)}</TableCell>
                        <TableCell>{formatCurrency(budget.dailyLimit)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingId(budget.id)}
                            aria-label={`Delete budget for ${formatDate(budget.date)}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
          title="Delete daily budget"
          description="This action cannot be undone. The daily budget will be permanently removed."
        />
      </div>
    </AppLayout>
  )
}
