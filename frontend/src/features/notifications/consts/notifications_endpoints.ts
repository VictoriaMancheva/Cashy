export const NOTIFICATIONS_ENDPOINTS = {
  base: '/api/notifications',
  byId: (id: number) => `/api/notifications/${id}`,
  markRead: (id: number) => `/api/notifications/${id}/read`,
  markAllRead: '/api/notifications/read-all',
  unreadCount: '/api/notifications/unread-count',
} as const
