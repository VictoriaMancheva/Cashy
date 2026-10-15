import { z } from 'zod'

export const NOTIFICATION_PRIORITIES = ['NORMAL', 'URGENT'] as const

export const NotificationSchema = z.object({
  id: z.number(),
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.string().nullable(),
  // Older backends and old rows have no priority: treat them as normal
  priority: z.enum(NOTIFICATION_PRIORITIES).catch('NORMAL'),
})

export type Notification = z.infer<typeof NotificationSchema>
