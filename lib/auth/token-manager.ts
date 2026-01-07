
import { tokenStorage } from '@/lib/utils/storage'
import { authAPI } from '@/lib/api/endpoints/auth'
import { jwtDecode } from 'jwt-decode'

interface JWTPayload {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null
  private isRefreshing = false
  private refreshPromise: Promise<string> | null = null

  /**
   * Decode JWT token
   */
  private decodeToken(token: string): JWTPayload | null {
    try {
      return jwtDecode<JWTPayload>(token)
    } catch (error) {
      console.error('Failed to decode token:', error)
      return null
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token)
    if (!decoded) return true

    // Check if token expires in next 30 seconds
    const expiresIn = decoded.exp * 1000 - Date.now()
    return expiresIn < 30000 // 30 seconds buffer
  }

  /**
   * Get time until token expiry (in milliseconds)
   */
  getTimeUntilExpiry(token: string): number {
    const decoded = this.decodeToken(token)
    if (!decoded) return 0

    return decoded.exp * 1000 - Date.now()
  }

  /**
   * Schedule automatic token refresh
   * Refreshes 2 minutes before expiry
   */
  scheduleTokenRefresh() {
    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
    }

    const accessToken = tokenStorage.getAccessToken()
    if (!accessToken) return

    const timeUntilExpiry = this.getTimeUntilExpiry(accessToken)
    
    // Refresh 2 minutes before expiry (or immediately if less than 2 minutes left)
    const refreshTime = Math.max(0, timeUntilExpiry - 2 * 60 * 1000)

    console.log(`[TokenManager] Scheduling refresh in ${Math.round(refreshTime / 1000)}s`)

    this.refreshTimer = setTimeout(() => {
      this.refreshAccessToken()
    }, refreshTime)
  }

  /**
   * Refresh access token
   * Handles race conditions and queues requests
   */
  async refreshAccessToken(): Promise<string> {
    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      console.log('[TokenManager] Refresh already in progress, waiting...')
      return this.refreshPromise
    }

    this.isRefreshing = true

    // Create new refresh promise
    this.refreshPromise = (async () => {
      try {
        const refreshToken = tokenStorage.getRefreshToken()

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        console.log('[TokenManager] Refreshing access token...')

        // Call refresh endpoint
        const response = await authAPI.refreshToken(refreshToken)

        // Save new tokens
        if (!tokenStorage.isUsingCookies()) {
          tokenStorage.setAccessToken(response.accessToken)
          tokenStorage.setRefreshToken(response.refreshToken)
        }

        console.log('[TokenManager] Token refreshed successfully')

        // Schedule next refresh
        this.scheduleTokenRefresh()

        return response.accessToken
      } catch (error) {
        console.error('[TokenManager] Token refresh failed:', error)
        
        // Clear tokens and redirect to login
        tokenStorage.clearTokens()
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }

        throw error
      } finally {
        this.isRefreshing = false
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  /**
   * Get valid access token (refreshes if needed)
   */
  async getValidAccessToken(): Promise<string | null> {
    const accessToken = tokenStorage.getAccessToken()

    if (!accessToken) {
      return null
    }

    // If token is expired or about to expire, refresh it
    if (this.isTokenExpired(accessToken)) {
      console.log('[TokenManager] Token expired, refreshing...')
      try {
        return await this.refreshAccessToken()
      } catch (error) {
        return null
      }
    }

    return accessToken
  }

  /**
   * Initialize token manager
   * Start auto-refresh timer
   */
  initialize() {
    const accessToken = tokenStorage.getAccessToken()
    
    if (accessToken && !this.isTokenExpired(accessToken)) {
      console.log('[TokenManager] Initialized')
      this.scheduleTokenRefresh()
    }
  }

  /**
   * Clean up timers
   */
  destroy() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
    }
  }
}

// Export singleton instance
export const tokenManager = new TokenManager()
