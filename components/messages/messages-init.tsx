'use client'

import { useMessageCount } from '@/hooks/use-message-count'

/**
 * MessagesInit
 * Mounts the useMessageCount hook at layout level (no UI rendered).
 * Keeps the navbar/sidebar unread badge in sync with the server and socket.
 */
export default function MessagesInit() {
  useMessageCount()
  return null
}
