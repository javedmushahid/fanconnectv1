import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { messagingAPI } from '@/lib/api/endpoints/messaging'

interface MessageStore {
  unreadCount: number
  fetchUnreadCount: () => Promise<void>
  incrementUnread: () => void
  resetUnread: () => void
}

/**
 * Message Store
 * Tracks the global unread message count for the navbar/sidebar badge.
 * The full messaging state (messages, conversations) stays in useMessaging hook.
 */
export const useMessageStore = create<MessageStore>()(
  devtools(
    (set) => ({
      unreadCount: 0,

      fetchUnreadCount: async () => {
        try {
          const count = await messagingAPI.getUnreadCount()
          set({ unreadCount: count })
        } catch {
          // Silent fail — badge just won't show on error
        }
      },

      incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),

      resetUnread: () => set({ unreadCount: 0 }),
    }),
    { name: 'MessageStore' }
  )
)
