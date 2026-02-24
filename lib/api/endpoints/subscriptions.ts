import apiClient from '../client'

export interface SubscriptionTier {
  id: string
  name: string
  description: string
  price: string
  benefits: string[]
  isActive: boolean
  subscribersCount?: number
  createdAt: string
}

export interface Subscription {
  id: string
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | string
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  creator: {
    id: string
    username: string
    name: string
    avatar: string | null
  }
  tier: {
    id: string
    name: string
    price: string
    benefits: string[]
  }
}

export const subscriptionsAPI = {
  /**
   * GET /subscriptions/tiers/:creatorId
   * Public — returns available tiers for a creator
   */
  getTiers: async (creatorId: string): Promise<SubscriptionTier[]> => {
    const { data } = await apiClient.get(`/subscriptions/tiers/${creatorId}`)
    return data.data.tiers
  },

  /**
   * POST /subscriptions/checkout
   * Creates a Stripe checkout session — returns a URL to redirect the user to
   */
  createCheckout: async (payload: {
    tierId: string
    successUrl: string
    cancelUrl: string
  }): Promise<{ url: string; sessionId: string }> => {
    const { data } = await apiClient.post('/subscriptions/checkout', payload)
    return data.data
  },

  /**
   * GET /subscriptions/check/:creatorId
   * Check if the current user is subscribed to a creator
   */
  checkSubscription: async (creatorId: string): Promise<{
    isSubscribed: boolean
    subscription?: {
      id: string
      status: string
      currentPeriodEnd: string
      cancelAtPeriodEnd: boolean
    }
  }> => {
    const { data } = await apiClient.get(`/subscriptions/check/${creatorId}`)
    return data.data
  },

  /**
   * GET /subscriptions/my-subscriptions
   * Returns all active subscriptions for the current user
   */
  getMySubscriptions: async (): Promise<Subscription[]> => {
    const { data } = await apiClient.get('/subscriptions/my-subscriptions')
    return data.data.subscriptions
  },

  /**
   * POST /subscriptions/verify-checkout
   * Idempotent — creates subscription from Stripe session if webhook hasn't fired yet
   */
  verifyCheckout: async (sessionId: string): Promise<{
    subscription: {
      id: string
      status: string
      currentPeriodEnd: string
      creator: { id: string; username: string; name: string; avatar: string | null }
      tier: { id: string; name: string; price: string; benefits: string[] }
    }
    alreadyProcessed: boolean
  }> => {
    const { data } = await apiClient.post('/subscriptions/verify-checkout', { sessionId })
    return data.data
  },

  /**
   * DELETE /subscriptions/:subscriptionId
   * Cancels at end of billing period
   */
  cancelSubscription: async (subscriptionId: string): Promise<{ message: string; endsAt: string }> => {
    const { data } = await apiClient.delete(`/subscriptions/${subscriptionId}`)
    return data.data
  },
}
