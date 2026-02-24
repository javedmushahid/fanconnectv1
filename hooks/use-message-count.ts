'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useMessageStore } from '@/store/message.store'
import { socketManager } from '@/lib/messaging/socket-manager'

/**
 * useMessageCount
 * - Fetches the initial unread message count from the API on mount
 * - Listens for `message:new` socket events and increments the count
 *   (only when the user is NOT on the /messages page)
 * - Resets the count to 0 whenever the user navigates to /messages
 *
 * Mount once at layout level via MessagesInit.
 */
export function useMessageCount() {
  const { fetchUnreadCount, incrementUnread, resetUnread } = useMessageStore()
  const pathname = usePathname()

  // Initial fetch
  useEffect(() => {
    fetchUnreadCount()
  }, [])

  // Reset badge when user is on the messages page
  useEffect(() => {
    if (pathname.startsWith('/messages')) {
      resetUnread()
    }
  }, [pathname])

  // Real-time: increment when a new message arrives and user is elsewhere
  useEffect(() => {
    const handleNewMessage = () => {
      if (!window.location.pathname.startsWith('/messages')) {
        incrementUnread()
      }
    }

    socketManager.on('message:new', handleNewMessage)
    return () => {
      socketManager.off('message:new', handleNewMessage)
    }
  }, [])
}
