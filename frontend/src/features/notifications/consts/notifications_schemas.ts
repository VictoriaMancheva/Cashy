import { z } from 'zod'

export const NotificationSchema = z.object({
  id: z.number(),
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.string().nullable(),
})

export type Notification = z.infer<typeof NotificationSchema>
