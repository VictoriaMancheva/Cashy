import { AlertTriangle, Bell, CheckCheck, Trash2 } from 'lucide-react'

import { EmptyState } from '@/components/common/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PaginationControls } from '@/components/ui/PaginationControls'
import { useNotifications_deleteMutation } from '@/features/notifications/hooks/useNotifications_deleteMutation'
import { useNotifications_markAllReadMutation } from '@/features/notifications/hooks/useNotifications_markAllReadMutation'
import { useNotifications_markReadMutation } from '@/features/notifications/hooks/useNotifications_markReadMutation'
import { useNotifications_notificationsQuery } from '@/features/notifications/hooks/useNotifications_notificationsQuery'
import { DEFAULT_PAGE_SIZE, usePagination } from '@/hooks/usePagination'
import { useTranslation } from '@/i18n/useTranslation'
import { AppLayout } from '@/layouts/AppLayout'
import { cn } from '@/lib/utils'
import { formatDate } from '@/utils/formatters'

export const Notifications_Page = () => {
  const { data: notifications } = useNotifications_notificationsQuery()
  const markReadMutation = useNotifications_markReadMutation()
  const markAllReadMutation = useNotifications_markAllReadMutation()
  const deleteMutation = useNotifications_deleteMutation()
  const { t } = useTranslation()
  const { page, setPage, totalPages, pageItems } = usePagination(notifications, DEFAULT_PAGE_SIZE)

  const hasUnread = notifications?.some((n) => !n.isRead) ?? false

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t('notifications.title')}</h1>
          {hasUnread && (
            <Button
              variant="outline"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              {t('notifications.markAllRead')}
            </Button>
          )}
        </div>

        {notifications == null || notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title={t('notifications.emptyTitle')}
            description={t('notifications.emptyDescription')}
          />
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {pageItems.map((notification) => {
                const isUrgent = notification.priority === 'URGENT'

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'flex items-start gap-4 rounded-lg border border-border p-4 transition-colors',
                      !notification.isRead && 'bg-primary/5 border-primary/20',
                      isUrgent && 'border-destructive/30',
                      isUrgent && !notification.isRead && 'bg-destructive/5 border-destructive/50'
                    )}
                  >
                    {isUrgent ? (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    ) : (
                      <div
                        className={cn(
                          'mt-1.5 h-2 w-2 rounded-full shrink-0',
                          notification.isRead ? 'bg-muted' : 'bg-primary'
                        )}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      {isUrgent && (
                        <Badge variant="destructive" className="mb-1">
                          {t('notifications.urgent')}
                        </Badge>
                      )}
                      <p className={cn('text-sm', !notification.isRead && 'font-medium text-foreground')}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markReadMutation.mutate(notification.id)}
                          disabled={markReadMutation.isPending}
                          aria-label={t('notifications.markReadAria')}
                        >
                          <CheckCheck className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(notification.id)}
                        disabled={deleteMutation.isPending}
                        aria-label={t('notifications.deleteAria')}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </AppLayout>
  )
}
