'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from './use-auth'
import { socketManager } from '@/lib/messaging/socket-manager'
import { messagingAPI, Message } from '@/lib/api/endpoints/messaging'
import { followsAPI, FollowUser } from '@/lib/api/endpoints/follows'
import { toast } from 'sonner'

/**
 * useMessaging Hook
 * Professional messaging hook with auto-reconnect, error handling, and state management
 */
export function useMessaging() {
  const { user: currentUser } = useAuth()

  // State
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [recipient, setRecipient] = useState<FollowUser | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  
  // Followers/Following
  const [followers, setFollowers] = useState<FollowUser[]>([])
  const [following, setFollowing] = useState<FollowUser[]>([])
  const [loadingFollowers, setLoadingFollowers] = useState(false)
  const [loadingFollowing, setLoadingFollowing] = useState(false)

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Fetch followers
   */
  const fetchFollowers = useCallback(async () => {
    if (!currentUser) return

    setLoadingFollowers(true)
    try {
      const users = await followsAPI.getFollowers(currentUser.id)
      setFollowers(users)
    } catch (error) {
      console.error('Failed to fetch followers:', error)
      toast.error('Failed to load followers')
    } finally {
      setLoadingFollowers(false)
    }
  }, [currentUser])

  /**
   * Fetch following
   */
  const fetchFollowing = useCallback(async () => {
    if (!currentUser) return

    setLoadingFollowing(true)
    try {
      const users = await followsAPI.getFollowing(currentUser.id)
      setFollowing(users)
    } catch (error) {
      console.error('Failed to fetch following:', error)
      toast.error('Failed to load following')
    } finally {
      setLoadingFollowing(false)
    }
  }, [currentUser])

  /**
   * Initialize socket connection
   */
  useEffect(() => {
    if (!currentUser) return

    console.log('[useMessaging] Initializing socket connection')

    const socket = socketManager.connect()

    // Connection status
    const handleConnect = () => setIsConnected(true)
    const handleDisconnect = () => setIsConnected(false)

    socketManager.on('message:new', handleConnect)
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    // Set initial state
    setIsConnected(socket.connected)

    // Message events
    const handleNewMessage = (data: any) => {
      if (!data?.message) return

      setMessages(prev => {
        if (prev.some(m => m.id === data.message.id)) return prev
        return [...prev, data.message]
      })

      // Auto-mark as delivered
      if (conversationId && data.message.senderId !== currentUser.id) {
        socketManager.emit('message:delivered', {
          conversationId,
          messageId: data.message.id,
          recipientId: data.message.senderId,
        })
      }
    }

    const handleMessageStatus = (data: any) => {
      if (!data?.messageId || !data?.status) return

      setMessages(prev =>
        prev.map(msg =>
          msg.id === data.messageId ? { ...msg, status: data.status } : msg
        )
      )
    }

    const handleTypingStart = (data: any) => {
      if (data?.conversationId === conversationId) {
        setIsTyping(true)
      }
    }

    const handleTypingStop = (data: any) => {
      if (data?.conversationId === conversationId) {
        setIsTyping(false)
      }
    }

    const handleUserOnline = (data: any) => {
      if (data?.userId) {
        setOnlineUsers(prev => new Set(prev).add(data.userId))
      }
    }

    const handleUserOffline = (data: any) => {
      if (data?.userId) {
        setOnlineUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(data.userId)
          return newSet
        })
      }
    }

    // Register event listeners
    socketManager.on('message:new', handleNewMessage)
    socketManager.on('message:status', handleMessageStatus)
    socketManager.on('typing:start', handleTypingStart)
    socketManager.on('typing:stop', handleTypingStop)
    socketManager.on('user:online', handleUserOnline)
    socketManager.on('user:offline', handleUserOffline)

    // Cleanup
    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socketManager.off('message:new', handleNewMessage)
      socketManager.off('message:status', handleMessageStatus)
      socketManager.off('typing:start', handleTypingStart)
      socketManager.off('typing:stop', handleTypingStop)
      socketManager.off('user:online', handleUserOnline)
      socketManager.off('user:offline', handleUserOffline)
      socketManager.disconnect()
    }
  }, [currentUser, conversationId])

  /**
   * Load followers and following on mount
   */
  useEffect(() => {
    if (currentUser) {
      fetchFollowers()
      fetchFollowing()
    }
  }, [currentUser, fetchFollowers, fetchFollowing])

  /**
   * Start conversation with user
   */
  const startConversation = useCallback(async (user: FollowUser) => {
    if (!user?.id) return

    try {
      setRecipient(user)

      const conversation = await messagingAPI.getOrCreateConversation(user.id)
      setConversationId(conversation.id)

      const conversationMessages = await messagingAPI.getConversationMessages(conversation.id)
      setMessages(conversationMessages)

      // Mark as delivered
      conversationMessages.forEach(msg => {
        if (msg.senderId !== currentUser?.id && socketManager.isConnected()) {
          socketManager.emit('message:delivered', {
            conversationId: conversation.id,
            messageId: msg.id,
            recipientId: user.id,
          })
        }
      })
    } catch (error) {
      console.error('Failed to load conversation:', error)
      toast.error('Failed to load conversation')
    }
  }, [currentUser])

  /**
   * Send message
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !recipient?.id || !conversationId) return

    try {
      const message = await messagingAPI.sendMessage(recipient.id, {
        content,
        type: 'TEXT',
      })

      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) return prev
        return [...prev, message]
      })

      // Emit sent event
      if (socketManager.isConnected()) {
        socketManager.emit('message:sent', {
          conversationId,
          messageId: message.id,
          recipientId: recipient.id,
        })
      }

      // Stop typing
      handleStopTyping()

      return message
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message')
      throw error
    }
  }, [recipient, conversationId])

  /**
   * Handle typing
   */
  const handleTyping = useCallback(() => {
    if (!socketManager.isConnected() || !conversationId || !recipient) return

    socketManager.emit('typing:start', {
      conversationId,
      recipientId: recipient.id,
    })

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping()
    }, 3000)
  }, [conversationId, recipient])

  /**
   * Stop typing
   */
  const handleStopTyping = useCallback(() => {
    if (!socketManager.isConnected() || !conversationId || !recipient) return

    socketManager.emit('typing:stop', {
      conversationId,
      recipientId: recipient.id,
    })
  }, [conversationId, recipient])

  /**
   * Reset conversation
   */
  const resetConversation = useCallback(() => {
    setRecipient(null)
    setMessages([])
    setConversationId(null)
  }, [])

  return {
    // State
    messages,
    isConnected,
    isTyping,
    conversationId,
    recipient,
    onlineUsers,
    followers,
    following,
    loadingFollowers,
    loadingFollowing,
    currentUser,

    // Actions
    startConversation,
    sendMessage,
    handleTyping,
    handleStopTyping,
    resetConversation,
    fetchFollowers,
    fetchFollowing,

    // Utilities
    isUserOnline: (userId: string) => onlineUsers.has(userId),
  }
}
