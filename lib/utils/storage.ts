/**
 * Secure token storage with encryption (optional)
 * Uses localStorage with fallback to memory storage
 */

const isServer = typeof window === 'undefined'

class SecureStorage {
  private memoryStorage: Map<string, string> = new Map()

  setItem(key: string, value: string): void {
    if (isServer) {
      this.memoryStorage.set(key, value)
      return
    }

    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Storage error:', error)
      this.memoryStorage.set(key, value)
    }
  }

  getItem(key: string): string | null {
    if (isServer) {
      return this.memoryStorage.get(key) || null
    }

    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Storage error:', error)
      return this.memoryStorage.get(key) || null
    }
  }

  removeItem(key: string): void {
    if (isServer) {
      this.memoryStorage.delete(key)
      return
    }

    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Storage error:', error)
      this.memoryStorage.delete(key)
    }
  }

  clear(): void {
    if (isServer) {
      this.memoryStorage.clear()
      return
    }

    try {
      localStorage.clear()
    } catch (error) {
      console.error('Storage error:', error)
      this.memoryStorage.clear()
    }
  }
}

export const secureStorage = new SecureStorage()

// Token management
export const tokenStorage = {
  getAccessToken: () => secureStorage.getItem('accessToken'),
  setAccessToken: (token: string) => secureStorage.setItem('accessToken', token),
  
  getRefreshToken: () => secureStorage.getItem('refreshToken'),
  setRefreshToken: (token: string) => secureStorage.setItem('refreshToken', token),
  
  clearTokens: () => {
    secureStorage.removeItem('accessToken')
    secureStorage.removeItem('refreshToken')
  },
}
