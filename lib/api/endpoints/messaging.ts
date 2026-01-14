import apiClient from '../client'

export interface Conversation {
  id: string
  participantIds: string[]
  lastMessageAt: string
  createdAt: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  recipientId: string
  content: string
  type: 'TEXT' | 'IMAGE' | 'VIDEO'
  status: 'SENT' | 'DELIVERED' | 'READ'
  createdAt: string
  sender?: {
    id: string
    name: string
    username: string
  }
}

export interface SendMessagePayload {
  content: string
  type: 'TEXT' | 'IMAGE' | 'VIDEO'
}

/**
 * Messaging API
 * All messaging endpoints with automatic cookie authentication
 */
export const messagingAPI = {
  /**
   * Get or create conversation with a user
   */
  getOrCreateConversation: async (userId: string): Promise<Conversation> => {
    const { data } = await apiClient.get(`/messages/conversations/${userId}`)
    return data.data.conversation
  },

  /**
   * Get conversation messages
   */
  getConversationMessages: async (conversationId: string): Promise<Message[]> => {
    const { data } = await apiClient.get(`/messages/conversations/${conversationId}/messages`)
    return data.data.messages
  },

  /**
   * Send message to user
   */
  sendMessage: async (recipientId: string, payload: SendMessagePayload): Promise<Message> => {
    const { data } = await apiClient.post(`/messages/${recipientId}`, payload)
    return data.data.message
  },

  /**
   * Get all conversations
   */
  getConversations: async (): Promise<Conversation[]> => {
    const { data } = await apiClient.get('/messages/conversations')
    return data.data.conversations
  },

  /**
   * Mark message as read
   */
  markAsRead: async (conversationId: string, messageId: string): Promise<void> => {
    await apiClient.post(`/messages/conversations/${conversationId}/read`, { messageId })
  },
}
