import { useState } from 'react'

import { CreditCard, Pencil, Trash2 } from 'lucide-react'

import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PaymentMethods_Form } from '@/features/paymentMethods/components/PaymentMethods_Form'
import type { PaymentMethod } from '@/features/paymentMethods/consts/paymentMethods_schemas'
import { usePaymentMethods_deleteMutation } from '@/features/paymentMethods/hooks/usePaymentMethods_deleteMutation'
import { usePaymentMethods_paymentMethodsQuery } from '@/features/paymentMethods/hooks/usePaymentMethods_paymentMethodsQuery'
import { AppLayout } from '@/layouts/AppLayout'

export const PaymentMethods_Page = () => {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<PaymentMethod | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: paymentMethods } = usePaymentMethods_paymentMethodsQuery()
  const deleteMutation = usePaymentMethods_deleteMutation()

  const handleNew = () => {
    setEditing(null)
    setOpen(true)
  }

  const handleEdit = (paymentMethod: PaymentMethod) => {
    setEditing(paymentMethod)
    setOpen(true)
  }

  const handleFormSuccess = () => {
    setOpen(false)
    setEditing(null)
  }

  const handleDeleteConfirm = () => {
    if (deletingId == null) return
    deleteMutation.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
    })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Payment Methods</h1>
          <Button onClick={handleNew}>New Payment Method</Button>
        </div>

        {paymentMethods == null || paymentMethods.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payment methods yet"
            description="Create your first payment method to start tracking how you pay."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentMethods.map((paymentMethod) => (
                <TableRow key={paymentMethod.id}>
                  <TableCell>{paymentMethod.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(paymentMethod)}
                        aria-label={`Edit ${paymentMethod.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(paymentMethod.id)}
                        aria-label={`Delete ${paymentMethod.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing != null ? 'Edit Payment Method' : 'New Payment Method'}</DialogTitle>
            </DialogHeader>
            <PaymentMethods_Form
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
          title="Delete payment method"
          description="This action cannot be undone. The payment method will be permanently removed."
        />
      </div>
    </AppLayout>
  )
}
