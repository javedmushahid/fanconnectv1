import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
})

interface QueueItem {
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}

let isRefreshing = false
let requestQueue: QueueItem[] = []

const processQueue = (error: Error | null = null) => {
  requestQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve()
    }
  })
  requestQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (!originalRequest) {
      return Promise.reject(error)
    }

    // Handle 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry refresh endpoint
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        console.log('[API] Refresh endpoint returned 401')
        return Promise.reject(error)
      }

      // Queue concurrent requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          requestQueue.push({ resolve, reject })
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        console.log('[API] 401 - Attempting refresh...')

        // Import authAPI dynamically to avoid circular dependency
        const { authAPI } = await import('./endpoints/auth')
        await authAPI.refreshToken()
        
        console.log('[API] ✅ Refreshed, retrying request')

        processQueue()
        return apiClient(originalRequest)
        
      } catch (refreshError) {
        console.error('[API] Refresh failed')
        
        processQueue(refreshError as Error)
        
        // Don't redirect here - let middleware handle it
        return Promise.reject(refreshError)
        
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
