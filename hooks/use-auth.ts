import { useStore } from '@/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { tokenStorage } from '@/lib/utils/storage'
import { authAPI } from '@/lib/api/endpoints/auth'

/**
 * Convenience hook for auth operations
 */
export const useAuth = () => {
  const router = useRouter()
  
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    pendingEmail,
    login,
    register,
    verifyOTP,
    logout,
    updateUser,
    setLoading,
  } = useStore()

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = tokenStorage.getAccessToken()

      if (accessToken && !user) {
        try {
          setLoading(true)
          const userData = await authAPI.getCurrentUser()
          updateUser(userData)
        } catch (error) {
          console.error('Failed to fetch user:', error)
          tokenStorage.clearTokens()
        } finally {
          setLoading(false)
        }
      }
    }

    initAuth()
  }, [])

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    pendingEmail,
    
    // Actions
    login: async (emailOrUsername: string, password: string) => {
      await login({ emailOrUsername, password })
      router.push('/feed')
    },
    
    register: async (email: string, password: string, username: string, displayName: string) => {
      await register({ email, password, username, displayName })
      router.push('/verify-otp')
    },
    
    verifyOTP: async (email: string, otp: string) => {
      await verifyOTP({ email, otp })
      router.push('/feed')
    },
    
    logout: async () => {
      await logout()
    },
    
    updateUser,
  }
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export const useRequireAuth = () => {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}
