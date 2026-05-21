import { Bell, CheckCheck, Trash2 } from 'lucide-react'

import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useNotifications_deleteMutation } from '@/features/notifications/hooks/useNotifications_deleteMutation'
import { useNotifications_markAllReadMutation } from '@/features/notifications/hooks/useNotifications_markAllReadMutation'
import { useNotifications_markReadMutation } from '@/features/notifications/hooks/useNotifications_markReadMutation'
import { useNotifications_notificationsQuery } from '@/features/notifications/hooks/useNotifications_notificationsQuery'
import { AppLayout } from '@/layouts/AppLayout'
import { formatDate } from '@/utils/formatters'

export const Notifications_Page = () => {
  const { data: notifications } = useNotifications_notificationsQuery()
  const markReadMutation = useNotifications_markReadMutation()
  const markAllReadMutation = useNotifications_markAllReadMutation()
  const deleteMutation = useNotifications_deleteMutation()

  const hasUnread = notifications?.some((n) => !n.isRead) ?? false

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          {hasUnread && (
            <Button
              variant="outline"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {notifications == null || notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You're all caught up! Notifications about your finances will appear here."
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'flex items-start gap-4 rounded-lg border border-border p-4 transition-colors',
                  !notification.isRead && 'bg-primary/5 border-primary/20'
                )}
              >
                <div
                  className={cn(
                    'mt-0.5 h-2 w-2 rounded-full shrink-0',
                    notification.isRead ? 'bg-muted' : 'bg-primary'
                  )}
                />
                <div className="flex-1 min-w-0">
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
                      aria-label="Mark as read"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(notification.id)}
                    disabled={deleteMutation.isPending}
                    aria-label="Delete notification"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
