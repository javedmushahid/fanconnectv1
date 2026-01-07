
/**
 * Secure token storage with httpOnly cookies (preferred)
 * Falls back to localStorage for development
 */

const isServer = typeof window === 'undefined'

// Cookie utilities
export const cookieStorage = {
  // Get cookie value
  getCookie: (name: string): string | null => {
    if (isServer) return null
    
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    
    return null
  },

  // Check if cookie exists
  hasCookie: (name: string): boolean => {
    return !!cookieStorage.getCookie(name)
  },

  // Delete cookie (client-side)
  deleteCookie: (name: string): void => {
    if (isServer) return
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  },
}

// Memory storage for SSR
class MemoryStorage {
  private storage: Map<string, string> = new Map()

  setItem(key: string, value: string): void {
    this.storage.set(key, value)
  }

  getItem(key: string): string | null {
    return this.storage.get(key) || null
  }

  removeItem(key: string): void {
    this.storage.delete(key)
  }

  clear(): void {
    this.storage.clear()
  }
}

// Secure storage (localStorage fallback)
class SecureStorage {
  private memoryStorage = new MemoryStorage()

  setItem(key: string, value: string): void {
    if (isServer) {
      this.memoryStorage.setItem(key, value)
      return
    }

    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Storage error:', error)
      this.memoryStorage.setItem(key, value)
    }
  }

  getItem(key: string): string | null {
    if (isServer) {
      return this.memoryStorage.getItem(key)
    }

    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Storage error:', error)
      return this.memoryStorage.getItem(key)
    }
  }

  removeItem(key: string): void {
    if (isServer) {
      this.memoryStorage.removeItem(key)
      return
    }

    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Storage error:', error)
      this.memoryStorage.removeItem(key)
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

// Token management (Cookie-first, localStorage fallback)
export const tokenStorage = {
  // Check if using httpOnly cookies
  isUsingCookies: () => {
    return cookieStorage.hasCookie('accessToken')
  },

  // Get access token (cookie first, then localStorage)
  getAccessToken: (): string | null => {
    const cookieToken = cookieStorage.getCookie('accessToken')
    if (cookieToken) return cookieToken
    
    return secureStorage.getItem('accessToken')
  },

  // Set access token (localStorage only - backend sets cookie)
  setAccessToken: (token: string) => {
    // Only set in localStorage if not using cookies
    if (!tokenStorage.isUsingCookies()) {
      secureStorage.setItem('accessToken', token)
    }
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    const cookieToken = cookieStorage.getCookie('refreshToken')
    if (cookieToken) return cookieToken
    
    return secureStorage.getItem('refreshToken')
  },

  // Set refresh token
  setRefreshToken: (token: string) => {
    if (!tokenStorage.isUsingCookies()) {
      secureStorage.setItem('refreshToken', token)
    }
  },

  // Clear all tokens
  clearTokens: () => {
    // Clear localStorage
    secureStorage.removeItem('accessToken')
    secureStorage.removeItem('refreshToken')
    
    // Clear cookies (client-side)
    cookieStorage.deleteCookie('accessToken')
    cookieStorage.deleteCookie('refreshToken')
  },
}
