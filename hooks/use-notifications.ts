'use client'

import { useEffect } from 'react'
import { useNotificationStore } from '@/store/notification.store'
import { socketManager } from '@/lib/messaging/socket-manager'
import { Notification } from '@/types/notification.types'

/**
 * useNotifications
 * Wires the notification store to the Socket.IO real-time channel.
 * - Fetches the initial unread count on mount
 * - Listens for `notification:new` socket events and pushes them into the store
 *
 * Use this hook once at the layout level (e.g. (main)/layout.tsx).
 * Individual components can call useNotificationStore() directly for data.
 */
export function useNotifications() {
  const store = useNotificationStore()

  // Poll unread count on mount (snapshot before socket is available)
  useEffect(() => {
    store.fetchUnreadCount()
  }, [])

  // Subscribe to real-time notifications
  useEffect(() => {
    const handleNewNotification = (notification: Notification) => {
      store.addNotification(notification)
    }

    socketManager.on('notification:new', handleNewNotification)

    return () => {
      socketManager.off('notification:new', handleNewNotification)
    }
  }, [])

  return store
}
