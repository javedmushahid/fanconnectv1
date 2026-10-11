import apiClient from '../client'

export interface FeedPostUser {
  id: string
  username: string
  name: string
  avatar: string | null
}

export interface FeedPost {
  id: string
  authorId: string
  content: string | null
  images: string[]
  visibility: 'FREE' | 'SUBSCRIBERS' | 'PPV' | string
  ppvPrice: number | null
  likesCount: number
  commentsCount: number
  viewsCount: number
  isLiked: boolean
  createdAt: string
  user: FeedPostUser
  isLocked: boolean
}

export interface FeedPagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage?: boolean
}

export interface FeedResponse {
  posts: FeedPost[]
  pagination: FeedPagination
}

export interface ApiCommentUser {
  id: string
  username: string
  name: string
  avatar: string | null
}

export interface ApiComment {
  id: string
  content: string
  authorId: string
  postId: string
  parentId: string | null
  createdAt: string
  user: ApiCommentUser
  replies?: ApiComment[]
  repliesCount: number
}

export interface RepliesResponse {
  replies: ApiComment[]
  pagination: FeedPagination
}

export interface CommentsResponse {
  comments: ApiComment[]
  pagination: FeedPagination
}

/**
 * Posts API
 */
export const postsAPI = {
  /**
   * GET /posts/feed?page=1&limit=20
   */
  getFeed: async (page = 1, limit = 20): Promise<FeedResponse> => {
    const { data } = await apiClient.get('/posts/feed', { params: { page, limit } })
    return data.data
  },

  /**
   * POST /posts/:postId/like
   */
  likePost: async (postId: string): Promise<void> => {
    await apiClient.post(`/posts/${postId}/like`)
  },

  /**
   * DELETE /posts/:postId/like
   */
  unlikePost: async (postId: string): Promise<void> => {
    await apiClient.delete(`/posts/${postId}/like`)
  },

  /**
   * GET /posts/:postId/comments?page=1&limit=20
   */
  getComments: async (postId: string, page = 1, limit = 20): Promise<CommentsResponse> => {
    const { data } = await apiClient.get(`/posts/${postId}/comments`, { params: { page, limit } })
    return data.data
  },

  /**
   * POST /posts/:postId/comments
   * Body: { content, parentId? }
   */
  addComment: async (postId: string, content: string, parentId?: string): Promise<ApiComment> => {
    const { data } = await apiClient.post(`/posts/${postId}/comments`, {
      content,
      ...(parentId && { parentId }),
    })
    return data.data.comment
  },

  /**
   * GET /posts/comments/:commentId/replies?page=1&limit=20
   */
  getReplies: async (commentId: string, page = 1, limit = 20): Promise<RepliesResponse> => {
    const { data } = await apiClient.get(`/posts/comments/${commentId}/replies`, { params: { page, limit } })
    return data.data
  },

  /**
   * DELETE /posts/comments/:commentId
   */
  deleteComment: async (commentId: string): Promise<void> => {
    await apiClient.delete(`/posts/comments/${commentId}`)
  },
}
