import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { AuthStore, User, LoginCredentials, RegisterCredentials, VerifyOTPPayload } from '@/types/auth.types'
import { authAPI } from '@/lib/api/endpoints/auth'
import { toast } from 'sonner'

/**
 * Auth Store
 * Simple state management for authentication
 * No persistence - cookies are source of truth
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      // State
      user: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      // Login action
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })

        try {
          const response = await authAPI.login(credentials)
          set({ user: response.user, isLoading: false })
          toast.success('Login successful!')
          return response.user
        } catch (error: any) {
          const message = error.response?.data?.message || 'Login failed'
          set({ error: message, isLoading: false })
          toast.error(message)
          throw error
        }
      },

      // Register action
      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authAPI.register(credentials)
          set({ isLoading: false })
          toast.success(response.message)
        } catch (error: any) {
          const message = error.response?.data?.message || 'Registration failed'
          set({ error: message, isLoading: false })
          toast.error(message)
          throw error
        }
      },

      // Verify OTP action
      verifyOTP: async (payload: VerifyOTPPayload) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authAPI.verifyOTP(payload)
          set({ user: response.user, isLoading: false })
          toast.success('Email verified successfully!')
          return response.user
        } catch (error: any) {
          const message = error.response?.data?.message || 'OTP verification failed'
          set({ error: message, isLoading: false })
          toast.error(message)
          throw error
        }
      },

      // Logout action
      logout: async () => {
        try {
          await authAPI.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({ user: null, error: null })
          toast.success('Logged out successfully')
        }
      },

      // Setters
      setUser: (user: User | null) => set({ user }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setInitialized: (isInitialized: boolean) => set({ isInitialized }),
      setError: (error: string | null) => set({ error }),
      
      // Reset
      reset: () => set({ user: null, isLoading: false, isInitialized: false, error: null }),
    }),
    { name: 'AuthStore' }
  )
)
