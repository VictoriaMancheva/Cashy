import { useState } from 'react'

import { Pencil, Target, Trash2, WalletMinimal } from 'lucide-react'

import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Goals_AddFundsForm } from '@/features/goals/components/Goals_AddFundsForm'
import { Goals_Form } from '@/features/goals/components/Goals_Form'
import type { Goal } from '@/features/goals/consts/goals_schemas'
import { useGoals_deleteMutation } from '@/features/goals/hooks/useGoals_deleteMutation'
import { useGoals_goalsQuery } from '@/features/goals/hooks/useGoals_goalsQuery'
import { AppLayout } from '@/layouts/AppLayout'
import { formatCurrency, formatDate } from '@/utils/formatters'

export const Goals_Page = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Goal | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [addFundsGoalId, setAddFundsGoalId] = useState<number | null>(null)

  const { data: goals } = useGoals_goalsQuery()
  const deleteMutation = useGoals_deleteMutation()

  const handleNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleEdit = (goal: Goal) => {
    setEditing(goal)
    setFormOpen(true)
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const handleDeleteConfirm = () => {
    if (deletingId == null) return
    deleteMutation.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
    })
  }

  const handleAddFundsSuccess = () => {
    setAddFundsGoalId(null)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Goals</h1>
          <Button onClick={handleNew}>New Goal</Button>
        </div>

        {goals == null || goals.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No goals yet"
            description="Create your first savings goal to start tracking your progress."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-semibold">{goal.name}</CardTitle>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(goal)}
                        aria-label={`Edit ${goal.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(goal.id)}
                        aria-label={`Delete ${goal.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress value={goal.progressPercentage} />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                    <span className="font-medium">{goal.progressPercentage}%</span>
                  </div>
                  {goal.deadline != null && (
                    <p className="text-xs text-muted-foreground">
                      Deadline: {formatDate(goal.deadline)}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setAddFundsGoalId(goal.id)}
                  >
                    <WalletMinimal className="h-4 w-4" />
                    Add Funds
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing != null ? 'Edit Goal' : 'New Goal'}</DialogTitle>
            </DialogHeader>
            <Goals_Form
              key={editing?.id ?? 'new'}
              defaultValues={editing}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={addFundsGoalId != null} onOpenChange={(isOpen) => { if (!isOpen) setAddFundsGoalId(null) }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Funds</DialogTitle>
            </DialogHeader>
            {addFundsGoalId != null && (
              <Goals_AddFundsForm
                key={addFundsGoalId}
                goalId={addFundsGoalId}
                onSuccess={handleAddFundsSuccess}
              />
            )}
          </DialogContent>
        </Dialog>

        <DeleteConfirmDialog
          open={deletingId != null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setDeletingId(null)
          }}
          onConfirm={handleDeleteConfirm}
          isPending={deleteMutation.isPending}
          title="Delete goal"
          description="This action cannot be undone. The goal will be permanently removed."
        />
      </div>
    </AppLayout>
  )
}
