import { authAPI } from '@/lib/api/endpoints/auth'

/**
 * Token Manager
 * Background token refresh every 50 seconds
 */
class TokenManager {
  private refreshInterval: NodeJS.Timeout | null = null
  private isRunning = false
  private readonly REFRESH_INTERVAL = 12 * 60 * 1000

  start() {
    if (this.isRunning) {
      console.log('[TokenManager] Already running')
      return
    }

    console.log('[TokenManager] Starting (every 50s)')
    this.isRunning = true
    
    this.refreshInterval = setInterval(async () => {
      await this.refresh()
    }, this.REFRESH_INTERVAL)
  }

  stop() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
      this.isRunning = false
      console.log('[TokenManager] Stopped')
    }
  }

  private async refresh() {
    try {
      console.log('[TokenManager] Refreshing...')
      await authAPI.refreshToken()
      console.log('[TokenManager] ✅ Refreshed')
    } catch (error: any) {
      console.error('[TokenManager] Failed:', error.response?.status)
      
      // If 401, token expired - stop trying and let user re-login
      if (error.response?.status === 401) {
        console.log('[TokenManager] Refresh token expired, stopping')
        this.stop()
        
        // Clear store and redirect (only if not already on login page)
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          const { useAuthStore } = await import('@/store/auth.store')
          useAuthStore.getState().reset()
          window.location.href = '/login?session=expired'
        }
      }
    }
  }

  async manualRefresh() {
    await this.refresh()
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      interval: `${this.REFRESH_INTERVAL / 1000}s`,
    }
  }
}

export const tokenManager = new TokenManager()

if (typeof window !== 'undefined') {
  (window as any).tokenManager = tokenManager
}
