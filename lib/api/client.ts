import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { tokenStorage } from '@/lib/utils/storage'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
})

// Request interceptor - Add access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken()
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Token refresh logic
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

// Response interceptor - Handle 401 and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (!originalRequest) {
      return Promise.reject(error)
    }

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request while refresh is happening
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = tokenStorage.getRefreshToken()

      if (!refreshToken) {
        // No refresh token, clear auth and redirect
        tokenStorage.clearTokens()
        processQueue(new Error('No refresh token'), null)
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        
        return Promise.reject(error)
      }

      try {
        // Attempt token refresh
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data

        // Save new tokens
        tokenStorage.setAccessToken(accessToken)
        if (newRefreshToken) {
          tokenStorage.setRefreshToken(newRefreshToken)
        }

        // Update original request header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        // Process queued requests
        processQueue(null, accessToken)

        // Retry original request
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed - logout user
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
