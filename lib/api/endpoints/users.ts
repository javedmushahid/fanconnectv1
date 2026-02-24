import apiClient from '../client'

export interface SearchUser {
  id: string
  username: string
  name: string
  avatar: string | null
  bio: string | null
  role: 'USER' | 'CREATOR' | 'ADMIN'
  followersCount: number
  followingCount: number
  postsCount: number
}

export interface SearchPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ProfileUser {
  id: string
  username: string
  name: string
  avatar: string | null
  banner: string | null
  bio: string | null
  role: 'USER' | 'CREATOR' | 'ADMIN'
  isVerified?: boolean
  followersCount: number
  followingCount: number
  postsCount: number
  createdAt: string
}

export interface ProfilePost {
  id: string
  content: string | null
  images: string[]
  visibility: 'FREE' | 'SUBSCRIBERS' | 'PAID' | string
  isLocked: boolean
  likesCount: number
  commentsCount: number
  viewsCount: number
  createdAt: string
}

export interface ProfileStory {
  id: string
  type: 'IMAGE' | 'VIDEO' | string
  mediaUrl: string
  thumbnailUrl: string | null
  duration: number | null
  visibility: string
  viewsCount: number
  expiresAt: string
  createdAt: string
}

export interface ProfileMoment {
  id: string
  videoUrl: string
  thumbnailUrl: string | null
  caption: string | null
  duration: number | null
  likesCount: number
  commentsCount: number
  viewsCount: number
  hashtags: string[]
  createdAt: string
}

export interface UserProfileData {
  user: ProfileUser
  isFollowing: boolean
  isSubscribed: boolean
  posts: ProfilePost[]
  stories: ProfileStory[]
  moments: ProfileMoment[]
}

/**
 * Users API
 */
export const usersAPI = {
  /**
   * GET /users/search?q=&page=1&limit=20
   * Search users by name or username
   */
  search: async (
    q: string,
    page = 1,
    limit = 5
  ): Promise<{ users: SearchUser[]; pagination: SearchPagination }> => {
    const { data } = await apiClient.get('/users/search', { params: { q, page, limit } })
    return data.data
  },

  /**
   * GET /users/:username
   * Get a user's full public profile (user + isFollowing + posts + stories + moments)
   * Response shape: { success, data: { user, isFollowing, posts, stories, moments } }
   */
  getProfileByUsername: async (username: string): Promise<UserProfileData> => {
    const { data } = await apiClient.get(`/users/${username}`)
    return data.data
  },

  /**
   * GET /users/id/:userId
   * Get a user's basic info by their ID
   */
  getUserById: async (userId: string): Promise<ProfileUser> => {
    const { data } = await apiClient.get(`/users/id/${userId}`)
    return data.data.user
  },
}
