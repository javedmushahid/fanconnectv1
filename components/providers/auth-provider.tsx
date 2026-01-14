'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { authAPI } from '@/lib/api/endpoints/auth'
import { tokenManager } from '@/lib/auth/token-manager'

/**
 * Auth Provider
 * Professional flow: Try to get user first, refresh if fails
 * 
 * Flow:
 * 1. Try GET /auth/me (backend checks accessToken)
 * 2. If success → We're authenticated
 * 3. If 401 → Try refresh, then get user again
 * 4. Start background timer
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, setInitialized } = useAuthStore()
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const initAuth = async () => {
      console.log('[AuthProvider] 🚀 Initializing...')
      setLoading(true)

      try {
        // Try to get user directly (backend will check accessToken)
        console.log('[AuthProvider] 📡 Attempting to fetch user...')
        const user = await authAPI.getCurrentUser()
        
        // Success! We have valid access token
        setUser(user)
        console.log('[AuthProvider] ✅ User loaded:', user.email)

        // Start background refresh
        tokenManager.start()
        console.log('[AuthProvider] ✅ Complete')

      } catch (error: any) {
        // If 401, access token expired - try to refresh
        if (error.response?.status === 401) {
          console.log('[AuthProvider] ⚠️ Access token expired, trying refresh...')
          
          try {
            // Refresh token
            await authAPI.refreshToken()
            console.log('[AuthProvider] ✅ Token refreshed')

            // Try to get user again
            console.log('[AuthProvider] 📡 Fetching user after refresh...')
            const user = await authAPI.getCurrentUser()
            setUser(user)
            console.log('[AuthProvider] ✅ User loaded:', user.email)

            // Start background refresh
            tokenManager.start()
            console.log('[AuthProvider] ✅ Complete')

          } catch (refreshError: any) {
            console.log('[AuthProvider] ❌ Refresh failed, not authenticated')
            setUser(null)
          }
        } else {
          console.log('[AuthProvider] ❌ Not authenticated')
          setUser(null)
        }
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    initAuth()

    return () => {
      tokenManager.stop()
    }
  }, [])

  return <>{children}</>
}
