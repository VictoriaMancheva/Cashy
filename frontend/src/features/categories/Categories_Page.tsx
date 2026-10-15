import { useState } from 'react'

import { Pencil, Tag, Trash2 } from 'lucide-react'

import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Categories_Form } from '@/features/categories/components/Categories_Form'
import type { Category } from '@/features/categories/consts/categories_schemas'
import { useCategories_categoriesQuery } from '@/features/categories/hooks/useCategories_categoriesQuery'
import { useCategories_deleteMutation } from '@/features/categories/hooks/useCategories_deleteMutation'
import { useTranslation } from '@/i18n/useTranslation'
import { AppLayout } from '@/layouts/AppLayout'

export const Categories_Page = () => {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: categories } = useCategories_categoriesQuery()
  const deleteMutation = useCategories_deleteMutation()
  const { t } = useTranslation()

  const handleNew = () => {
    setEditing(null)
    setOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditing(category)
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
          <h1 className="text-2xl font-bold text-foreground">{t('categories.title')}</h1>
          <Button onClick={handleNew}>{t('categories.new')}</Button>
        </div>

        {categories == null || categories.length === 0 ? (
          <EmptyState
            icon={Tag}
            title={t('categories.emptyTitle')}
            description={t('categories.emptyDescription')}
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
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category)}
                        aria-label={t('common.editNamed', { name: category.name })}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(category.id)}
                        aria-label={t('common.deleteNamed', { name: category.name })}
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
              <DialogTitle>{editing != null ? t('categories.edit') : t('categories.new')}</DialogTitle>
            </DialogHeader>
            <Categories_Form
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
          title={t('categories.deleteTitle')}
          description={t('categories.deleteDescription')}
        />
      </div>
    </AppLayout>
  )
}
