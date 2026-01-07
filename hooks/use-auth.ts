
import { useStore } from '@/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { tokenStorage } from '@/lib/utils/storage'
import { tokenManager } from '@/lib/auth/token-manager'
import { authAPI } from '@/lib/api/endpoints/auth'

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

  // Initialize auth and token manager
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = tokenStorage.getAccessToken()

      if (accessToken && !user) {
        try {
          setLoading(true)
          
          // Initialize token manager (starts auto-refresh)
          tokenManager.initialize()
          
          // Fetch user data
          const userData = await authAPI.getCurrentUser()
          updateUser(userData)
        } catch (error) {
          console.error('Failed to fetch user:', error)
          tokenStorage.clearTokens()
        } finally {
          setLoading(false)
        }
      } else if (accessToken) {
        // Just initialize token manager if user already exists
        tokenManager.initialize()
      }
    }

    initAuth()

    // Cleanup
    return () => {
      tokenManager.destroy()
    }
  }, [])

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    pendingEmail,
    
    // Actions
    login: async (email: string, password: string) => {
      await login({ email, password })
      tokenManager.initialize() // Start auto-refresh
      router.push('/feed')
    },
    
    register: async (email: string, password: string, username: string, name: string) => {
      await register({ email, password, username, name })
      router.push('/verify-otp')
    },
    
    verifyOTP: async (email: string, otp: string) => {
      await verifyOTP({ email, otp })
      tokenManager.initialize() // Start auto-refresh
      router.push('/feed')
    },
    
    logout: async () => {
      tokenManager.destroy() // Stop auto-refresh
      await logout()
    },
    
    updateUser,
  }
}

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
