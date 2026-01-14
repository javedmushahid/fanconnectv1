'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { tokenManager } from '@/lib/auth/token-manager'

/**
 * useAuth Hook
 * Convenient access to auth state and actions
 * Handles routing after auth actions
 */
export function useAuth() {
  const router = useRouter()
  const store = useAuthStore()

  return {
    // State
    user: store.user,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    isAuthenticated: !!store.user,
    error: store.error,

    // Actions with routing
    login: async (emailOrUsername: string, password: string) => {
      const user = await store.login({ emailOrUsername, password })
      tokenManager.start() // Start refresh timer after login
      router.push('/feed')
      return user
    },

    register: async (email: string, username: string, password: string, name: string) => {
      await store.register({ email, username, password, name })
      router.push('/verify-otp?email=' + encodeURIComponent(email))
    },

    verifyOTP: async (email: string, otp: string) => {
      const user = await store.verifyOTP({ email, otp })
      tokenManager.start() // Start refresh timer after verification
      router.push('/feed')
      return user
    },

    logout: async () => {
      tokenManager.stop() // Stop refresh timer
      await store.logout()
      router.push('/login')
    },

    // Direct state setters
    setUser: store.setUser,
    setError: store.setError,
  }
}
