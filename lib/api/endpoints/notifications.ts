import apiClient from '../client'
import {
  Notification,
  PaginatedNotifications,
  NotificationPreferences,
} from '@/types/notification.types'

/**
 * Notifications API
 * All notification endpoints with automatic cookie authentication
 */
export const notificationsAPI = {
  /**
   * GET /notifications?page=1&limit=20
   * Get paginated notifications
   */
  getNotifications: async (page = 1, limit = 20): Promise<PaginatedNotifications> => {
    const { data } = await apiClient.get('/notifications', { params: { page, limit } })
    return data.data
  },

  /**
   * GET /notifications/unread
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<number> => {
    const { data } = await apiClient.get('/notifications/unread')
    return data.data.count
  },

  /**
   * PATCH /notifications/:notificationId/read
   * Mark a single notification as read
   */
  markAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.patch(`/notifications/${notificationId}/read`)
  },

  /**
   * PATCH /notifications/read-all
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all')
  },

  /**
   * DELETE /notifications/:notificationId
   * Delete a single notification
   */
  deleteNotification: async (notificationId: string): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}`)
  },

  /**
   * DELETE /notifications/clear-all/all
   * Clear all notifications
   */
  clearAll: async (): Promise<void> => {
    await apiClient.delete('/notifications/clear-all/all')
  },

  /**
   * GET /notifications/settings/preferences
   * Get notification preferences
   */
  getPreferences: async (): Promise<NotificationPreferences> => {
    const { data } = await apiClient.get('/notifications/settings/preferences')
    return data.data
  },

  /**
   * PATCH /notifications/settings/preferences
   * Update notification preferences
   */
  updatePreferences: async (
    prefs: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> => {
    const { data } = await apiClient.patch('/notifications/settings/preferences', prefs)
    return data.data
  },
}
