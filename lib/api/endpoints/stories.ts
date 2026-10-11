import apiClient from '../client'

// --- Types ---

export interface StoryCreator {
  id: string
  username: string
  name: string
  avatar: string | null
}

export interface Story {
  id: string
  creatorId: string
  type: 'IMAGE' | 'VIDEO'
  mediaUrl: string
  thumbnailUrl: string | null
  duration: number | null
  visibility: 'PUBLIC' | 'FOLLOWERS' | 'SUBSCRIBERS' | 'CLOSE_FRIENDS'
  viewsCount: number
  expiresAt: string
  createdAt: string
  creator?: StoryCreator
  isViewed?: boolean
}

export interface StoryFeedItem {
  creator: StoryCreator
  stories: Story[]
  hasUnviewed: boolean
}

export interface Highlight {
  id: string
  creatorId: string
  title: string
  coverUrl: string | null
  storyIds: string[]
  createdAt: string
}

export interface StoryViewerEntry {
  user: StoryCreator
  viewedAt: string
}

// --- API ---

export const storiesAPI = {
  /**
   * POST /stories
   * Create a new story (multipart/form-data)
   */
  createStory: async (
    file: File,
    type: 'IMAGE' | 'VIDEO',
    visibility: 'PUBLIC' | 'FOLLOWERS' | 'SUBSCRIBERS' | 'CLOSE_FRIENDS' = 'PUBLIC'
  ): Promise<{ story: Story }> => {
    const formData = new FormData()
    formData.append('media', file)
    formData.append('type', type)
    formData.append('visibility', visibility)
    const { data } = await apiClient.post('/stories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  /**
   * GET /stories/feed
   * Get stories feed grouped by creator
   */
  getFeed: async (): Promise<{ stories: StoryFeedItem[] }> => {
    const { data } = await apiClient.get('/stories/feed')
    return data.data
  },

  /**
   * GET /stories/user/:userId
   * Get all active stories for a specific user
   */
  getUserStories: async (
    userId: string
  ): Promise<{ creator: StoryCreator; stories: Story[] }> => {
    const { data } = await apiClient.get(`/stories/user/${userId}`)
    return data.data
  },

  /**
   * GET /stories/:storyId
   * Get a single story by ID
   */
  getStoryById: async (storyId: string): Promise<{ story: Story }> => {
    const { data } = await apiClient.get(`/stories/${storyId}`)
    return data.data
  },

  /**
   * POST /stories/:storyId/view
   * Mark a story as viewed
   */
  markViewed: async (storyId: string): Promise<void> => {
    await apiClient.post(`/stories/${storyId}/view`)
  },

  /**
   * GET /stories/:storyId/viewers
   * Get viewers of a story (creator only)
   */
  getViewers: async (
    storyId: string
  ): Promise<{ viewers: StoryViewerEntry[]; totalViews: number }> => {
    const { data } = await apiClient.get(`/stories/${storyId}/viewers`)
    return data.data
  },

  /**
   * DELETE /stories/:storyId
   * Delete a story (creator only)
   */
  deleteStory: async (storyId: string): Promise<void> => {
    await apiClient.delete(`/stories/${storyId}`)
  },

  /**
   * POST /stories/highlights
   * Create a highlight
   */
  createHighlight: async (
    title: string,
    storyIds: string[],
    coverUrl?: string
  ): Promise<{ highlight: Highlight }> => {
    const { data } = await apiClient.post('/stories/highlights', {
      title,
      storyIds,
      coverUrl,
    })
    return data.data
  },

  /**
   * GET /stories/highlights/:userId
   * Get highlights for a user
   */
  getHighlights: async (userId: string): Promise<{ highlights: Highlight[] }> => {
    const { data } = await apiClient.get(`/stories/highlights/${userId}`)
    return data.data
  },

  /**
   * DELETE /stories/highlights/:highlightId
   * Delete a highlight (creator only)
   */
  deleteHighlight: async (highlightId: string): Promise<void> => {
    await apiClient.delete(`/stories/highlights/${highlightId}`)
  },
}
