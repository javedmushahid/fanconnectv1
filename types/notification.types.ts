export type NotificationType =
  | 'FOLLOW'
  | 'LIKE'
  | 'COMMENT'
  | 'MENTION'
  | 'SUBSCRIBER'
  | 'MESSAGE'
  | 'STORY_VIEW'
  | 'MOMENT_LIKE'
  | 'MOMENT_COMMENT'
  | 'POST_COMMENT'

export interface NotificationActor {
  id: string
  name: string
  username: string
  avatar: string | null
}

export interface Notification {
  id: string
  type: NotificationType
  actor: NotificationActor
  content: string
  postPreview?: string
  isRead: boolean
  createdAt: string
}

export interface PaginatedNotifications {
  notifications: Notification[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export type NotificationPreferenceKey =
  | 'follow'
  | 'like'
  | 'comment'
  | 'mention'
  | 'subscriber'
  | 'message'

export interface NotificationPreferences {
  follow: boolean
  like: boolean
  comment: boolean
  mention: boolean
  subscriber: boolean
  message: boolean
}

// Zustand store types
export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  currentPage: number
  preferences: NotificationPreferences | null
  isLoadingPreferences: boolean
}

export interface NotificationActions {
  fetchNotifications: (page?: number) => Promise<void>
  fetchMoreNotifications: () => Promise<void>
  fetchUnreadCount: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  clearAll: () => Promise<void>
  fetchPreferences: () => Promise<void>
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>
  addNotification: (notification: Notification) => void
  reset: () => void
}

export type NotificationStore = NotificationState & NotificationActions
