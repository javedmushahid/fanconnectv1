import apiClient from '../client'

export interface FollowUser {
  id: string
  email: string
  username: string
  name: string
  avatar: string | null
  bio?: string | null
}

export interface FollowersResponse {
  followers: Array<{ follower: FollowUser }>
  total: number
  page: number
  limit: number
}

export interface FollowingResponse {
  following: Array<{ following: FollowUser }>
  total: number
  page: number
  limit: number
}

/**
 * Follows API
 * All follow-related endpoints
 */
export const followsAPI = {
  /**
   * Get user's followers
   */
  getFollowers: async (userId: string, page = 1, limit = 50): Promise<FollowUser[]> => {
    const { data } = await apiClient.get<{ success: boolean; data: FollowersResponse }>(
      `/follows/${userId}/followers?page=${page}&limit=${limit}`
    )
    
    if (!data.success || !data.data?.followers) {
      return []
    }
    
    return data.data.followers
      .map(f => f)
      .filter(user => user && user.id)
  },

  /**
   * Get users that user is following
   */
  getFollowing: async (userId: string, page = 1, limit = 50): Promise<FollowUser[]> => {
    const { data } = await apiClient.get<{ success: boolean; data: FollowingResponse }>(
      `/follows/${userId}/following?page=${page}&limit=${limit}`
    )
    
    if (!data.success || !data.data?.following) {
      return []
    }
    
    return data.data.following
      .map(f => f)
      .filter(user => user && user.id)
  },

  /**
   * Follow a user
   */
  followUser: async (userId: string): Promise<void> => {
    await apiClient.post(`/follows/${userId}`)
  },

  /**
   * Unfollow a user
   */
  unfollowUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/follows/${userId}`)
  },
}
