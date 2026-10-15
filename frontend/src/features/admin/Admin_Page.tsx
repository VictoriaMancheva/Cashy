import { useState } from 'react'

import { Shield, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAdmin_deleteUserMutation } from '@/features/admin/hooks/useAdmin_deleteUserMutation'
import { useAdmin_updateRoleMutation } from '@/features/admin/hooks/useAdmin_updateRoleMutation'
import { useAdmin_usersQuery } from '@/features/admin/hooks/useAdmin_usersQuery'
import { useTranslation } from '@/i18n/useTranslation'
import { AppLayout } from '@/layouts/AppLayout'
import { formatDate } from '@/utils/formatters'
import type { Role } from '@/utils/roles'
import { isRole, ROLES } from '@/utils/roles'

const roleBadgeVariant = (role: string) => {
  if (role === 'ADMIN') return 'destructive'
  if (role === 'PREMIUM') return 'default'
  return 'secondary'
}

export const Admin_Page = () => {
  const { t } = useTranslation()
  const { data: users, isLoading } = useAdmin_usersQuery()
  const updateRoleMutation = useAdmin_updateRoleMutation()
  const deleteUserMutation = useAdmin_deleteUserMutation()
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleRoleChange = (id: number, role: Role) => {
    updateRoleMutation.mutate({ id, role })
  }

  const handleDeleteConfirm = () => {
    if (deleteId === null) return
    deleteUserMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">{t('admin.title')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.allUsers')}</CardTitle>
            <CardDescription>{t('admin.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">{t('admin.loading')}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('auth.username')}</TableHead>
                    <TableHead>{t('auth.email')}</TableHead>
                    <TableHead>{t('profile.role')}</TableHead>
                    <TableHead>{t('profile.memberSince')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={roleBadgeVariant(user.role)}>
                            {isRole(user.role) ? t(`roles.${user.role}` as const) : user.role}
                          </Badge>
                          <Select
                            value={user.role}
                            onValueChange={(val) => {
                              if (isRole(val)) handleRoleChange(user.id, val)
                            }}
                          >
                            <SelectTrigger className="h-7 w-28 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLES.map((r) => (
                                <SelectItem key={r} value={r} className="text-xs">
                                  {t(`roles.${r}` as const)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(user.id)}
                          aria-label={t('admin.deleteUserAria')}
                        >
                          <Trash2 className="h-4 w-4" />
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

      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.deleteUserTitle')}</DialogTitle>
            <DialogDescription>
              {t('admin.deleteUserDescription')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteUserMutation.isPending}
            >
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
