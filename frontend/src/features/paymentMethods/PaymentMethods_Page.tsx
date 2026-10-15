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
import { useTranslation } from '@/i18n/useTranslation'
import { AppLayout } from '@/layouts/AppLayout'

export const PaymentMethods_Page = () => {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<PaymentMethod | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: paymentMethods } = usePaymentMethods_paymentMethodsQuery()
  const deleteMutation = usePaymentMethods_deleteMutation()
  const { t } = useTranslation()

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
          <h1 className="text-2xl font-bold text-foreground">{t('paymentMethods.title')}</h1>
          <Button onClick={handleNew}>{t('paymentMethods.new')}</Button>
        </div>

        {paymentMethods == null || paymentMethods.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title={t('paymentMethods.emptyTitle')}
            description={t('paymentMethods.emptyDescription')}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.name')}</TableHead>
                <TableHead className="w-24 text-right">{t('common.actions')}</TableHead>
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
                        aria-label={t('common.editNamed', { name: paymentMethod.name })}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(paymentMethod.id)}
                        aria-label={t('common.deleteNamed', { name: paymentMethod.name })}
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
              <DialogTitle>{editing != null ? t('paymentMethods.edit') : t('paymentMethods.new')}</DialogTitle>
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
          title={t('paymentMethods.deleteTitle')}
          description={t('paymentMethods.deleteDescription')}
        />
      </div>
    </AppLayout>
  )
}
