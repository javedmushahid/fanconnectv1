export interface User {
  id: string
  email: string
  username: string
  displayName: string
  bio: string
  avatar: string
  banner: string
  role: 'creator' | 'subscriber'
  isVerified: boolean
  createdAt: string
}

export interface Post {
  id: string
  creatorId: string
  creator: User
  content: string
  mediaUrls: string[]
  mediaType: 'image' | 'video' | 'text'
  isLocked: boolean
  price?: number
  likesCount: number
  commentsCount: number
  createdAt: string
}

export interface Subscription {
  id: string
  subscriberId: string
  creatorId: string
  tier: string
  price: number
  status: 'active' | 'cancelled' | 'expired'
  currentPeriodEnd: string
}

export interface Comment {
  id: string
  postId: string
  userId: string
  user: User
  content: string
  createdAt: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: string
}
