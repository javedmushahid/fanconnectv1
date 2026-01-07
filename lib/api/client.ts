
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { tokenStorage } from '@/lib/utils/storage'
import { tokenManager } from '@/lib/auth/token-manager'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true, // Send cookies
})

// Request queue for pending requests during token refresh
interface QueueItem {
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}

let isRefreshing = false
let requestQueue: QueueItem[] = []

const processQueue = (error: Error | null = null, token: string | null = null) => {
  requestQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })

  requestQueue = []
}

// Request interceptor - Add access token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip auth for refresh token endpoint
    if (config.url?.includes('/auth/refresh-token')) {
      return config
    }

    // Get valid token (auto-refreshes if needed)
    const token = await tokenManager.getValidAccessToken()

    // Add token to header if not using cookies
    if (token && !tokenStorage.isUsingCookies() && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (!originalRequest) {
      return Promise.reject(error)
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Avoid infinite loops
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        tokenStorage.clearTokens()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          requestQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        console.log('[API Client] 401 error, refreshing token...')

        // Refresh token
        const newToken = await tokenManager.refreshAccessToken()

        // Update original request
        if (originalRequest.headers && newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }

        // Process queued requests
        processQueue(null, newToken)

        // Retry original request
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout
        processQueue(refreshError as Error, null)
        tokenStorage.clearTokens()
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
