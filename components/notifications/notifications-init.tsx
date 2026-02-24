'use client'

import { useNotifications } from '@/hooks/use-notifications'

/**
 * NotificationsInit
 * Mounts the useNotifications hook (unread count fetch + socket listener)
 * at the layout level without rendering any UI.
 */
export default function NotificationsInit() {
  useNotifications()
  return null
}
