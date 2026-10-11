import apiClient from '../client'

export interface FollowUser {
  id: string
  username: string
  name: string
  avatar: string | null
  bio: string | null
}

export interface FollowPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface FollowListResult {
  users: FollowUser[]
  pagination: FollowPagination
}

export interface SuggestedUser {
  id: string
  username: string
  name: string
  avatar: string | null
  bio: string | null
  followersCount: number
}

export const followsAPI = {
  /**
   * GET /follows/:userId/followers?page=1&limit=20
   */
  getFollowers: async (userId: string, page = 1, limit = 20): Promise<FollowListResult> => {
    const { data } = await apiClient.get(`/follows/${userId}/followers`, { params: { page, limit } })
    return {
      users: data.data.followers ?? [],
      pagination: data.data.pagination,
    }
  },

  /**
   * GET /follows/:userId/following?page=1&limit=20
   */
  getFollowing: async (userId: string, page = 1, limit = 20): Promise<FollowListResult> => {
    const { data } = await apiClient.get(`/follows/${userId}/following`, { params: { page, limit } })
    return {
      users: data.data.following ?? [],
      pagination: data.data.pagination,
    }
  },

  /**
   * GET /follows/:userId/check
   */
  checkFollow: async (userId: string): Promise<boolean> => {
    const { data } = await apiClient.get(`/follows/${userId}/check`)
    return data.data.isFollowing ?? false
  },

  /**
   * GET /follows/suggestions/users?limit=5
   */
  getSuggestions: async (limit = 5): Promise<SuggestedUser[]> => {
    const { data } = await apiClient.get<{ success: boolean; data: { suggestions: SuggestedUser[] } }>(
      `/follows/suggestions/users?limit=${limit}`
    )
    if (!data.success || !data.data?.suggestions) return []
    return data.data.suggestions
  },

  /**
   * POST /follows/:userId
   */
  followUser: async (userId: string): Promise<void> => {
    await apiClient.post(`/follows/${userId}`)
  },

  /**
   * DELETE /follows/:userId
   */
  unfollowUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/follows/${userId}`)
  },
}