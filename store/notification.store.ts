import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { NotificationStore, Notification, NotificationPreferences } from '@/types/notification.types'
import { notificationsAPI } from '@/lib/api/endpoints/notifications'
import { toast } from 'sonner'

/**
 * Notification Store
 * Manages notification state with optimistic updates
 * Real-time updates handled via useNotifications hook (socket)
 */
export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      // State
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      isLoadingMore: false,
      hasMore: true,
      currentPage: 1,
      preferences: null,
      isLoadingPreferences: false,

      // Fetch first page of notifications
      fetchNotifications: async (page = 1) => {
        set({ isLoading: true })
        try {
          const result = await notificationsAPI.getNotifications(page)
          set({
            notifications: result.notifications,
            hasMore: result.hasMore,
            currentPage: page,
            isLoading: false,
          })
        } catch {
          set({ isLoading: false })
        }
      },

      // Load next page (append)
      fetchMoreNotifications: async () => {
        const { hasMore, isLoadingMore, currentPage, notifications } = get()
        if (!hasMore || isLoadingMore) return

        set({ isLoadingMore: true })
        try {
          const result = await notificationsAPI.getNotifications(currentPage + 1)
          set({
            notifications: [...notifications, ...result.notifications],
            hasMore: result.hasMore,
            currentPage: currentPage + 1,
            isLoadingMore: false,
          })
        } catch {
          set({ isLoadingMore: false })
        }
      },

      // Fetch unread count (used in navbar badge)
      fetchUnreadCount: async () => {
        try {
          const count = await notificationsAPI.getUnreadCount()
          set({ unreadCount: count })
        } catch {
          // Silent fail — badge simply won't update
        }
      },

      // Mark single notification as read (optimistic)
      markAsRead: async (notificationId: string) => {
        const target = get().notifications.find(n => n.id === notificationId)
        if (!target || target.isRead) return

        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }))

        try {
          await notificationsAPI.markAsRead(notificationId)
        } catch {
          // Revert on failure
          set(state => ({
            notifications: state.notifications.map(n =>
              n.id === notificationId ? { ...n, isRead: false } : n
            ),
            unreadCount: state.unreadCount + 1,
          }))
        }
      },

      // Mark all as read (optimistic)
      markAllAsRead: async () => {
        const previousUnread = get().unreadCount

        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true })),
          unreadCount: 0,
        }))

        try {
          await notificationsAPI.markAllAsRead()
        } catch {
          set({ unreadCount: previousUnread })
          toast.error('Failed to mark all as read')
        }
      },

      // Delete single notification (optimistic)
      deleteNotification: async (notificationId: string) => {
        const prev = get().notifications
        const target = prev.find(n => n.id === notificationId)

        set(state => ({
          notifications: state.notifications.filter(n => n.id !== notificationId),
          unreadCount: target && !target.isRead
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
        }))

        try {
          await notificationsAPI.deleteNotification(notificationId)
        } catch {
          set({ notifications: prev })
          toast.error('Failed to delete notification')
        }
      },

      // Clear all notifications (optimistic)
      clearAll: async () => {
        const prev = get().notifications
        set({ notifications: [], unreadCount: 0 })

        try {
          await notificationsAPI.clearAll()
          toast.success('All notifications cleared')
        } catch {
          set({ notifications: prev })
          toast.error('Failed to clear notifications')
        }
      },

      // Fetch notification preferences
      fetchPreferences: async () => {
        set({ isLoadingPreferences: true })
        try {
          const prefs = await notificationsAPI.getPreferences()
          set({ preferences: prefs, isLoadingPreferences: false })
        } catch {
          set({ isLoadingPreferences: false })
        }
      },

      // Update notification preferences (optimistic)
      updatePreferences: async (prefs: Partial<NotificationPreferences>) => {
        const previous = get().preferences

        set(state => ({
          preferences: state.preferences ? { ...state.preferences, ...prefs } : null,
        }))

        try {
          const updated = await notificationsAPI.updatePreferences(prefs)
          set({ preferences: updated })
          toast.success('Preferences saved')
        } catch {
          set({ preferences: previous })
          toast.error('Failed to save preferences')
        }
      },

      // Called by socket handler when a real-time notification arrives
      addNotification: (notification: Notification) => {
        set(state => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }))
      },

      // Reset entire store (called on logout)
      reset: () =>
        set({
          notifications: [],
          unreadCount: 0,
          isLoading: false,
          isLoadingMore: false,
          hasMore: true,
          currentPage: 1,
          preferences: null,
          isLoadingPreferences: false,
        }),
    }),
    { name: 'NotificationStore' }
  )
)
