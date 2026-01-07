
import { StateCreator } from 'zustand'
import { authAPI } from '@/lib/api/endpoints/auth'
import { tokenStorage } from '@/lib/utils/storage'
import {
  AuthStore,
  LoginCredentials,
  RegisterCredentials,
  VerifyOTPPayload,
  User,
} from '@/types/auth.types'
import { toast } from 'sonner'

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  pendingEmail: null,
}

export const createAuthSlice: StateCreator<AuthStore> = (set, get) => ({
  ...initialState,

  // Login
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null })

    try {
      const response = await authAPI.login(credentials)

      // Save tokens (only if not using httpOnly cookies)
      if (!tokenStorage.isUsingCookies()) {
        tokenStorage.setAccessToken(response.tokens.accessToken)
        tokenStorage.setRefreshToken(response.tokens.refreshToken)
      }

      // Update state
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })

      toast.success('Login successful!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      
      set({
        isLoading: false,
        error: message,
        isAuthenticated: false,
      })

      toast.error(message)
      throw error
    }
  },

  // Register
  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null })

    try {
      const response = await authAPI.register(credentials)

      set({
        isLoading: false,
        error: null,
        pendingEmail: credentials.email,
      })

      toast.success('OTP sent to your email!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      
      set({
        isLoading: false,
        error: message,
      })

      toast.error(message)
      throw error
    }
  },

  // Verify OTP
  verifyOTP: async (payload: VerifyOTPPayload) => {
    set({ isLoading: true, error: null })

    try {
      const response = await authAPI.verifyOTP(payload)

      // Save tokens (only if not using httpOnly cookies)
      if (!tokenStorage.isUsingCookies()) {
        tokenStorage.setAccessToken(response.tokens.accessToken)
        tokenStorage.setRefreshToken(response.tokens.refreshToken)
      }

      // Update state
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        pendingEmail: null,
      })

      toast.success('Account verified successfully!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'OTP verification failed'
      
      set({
        isLoading: false,
        error: message,
      })

      toast.error(message)
      throw error
    }
  },

  // Refresh Token
  refreshToken: async () => {
    const currentRefreshToken = tokenStorage.getRefreshToken()

    if (!currentRefreshToken) {
      get().logout()
      return
    }

    try {
      const response = await authAPI.refreshToken(currentRefreshToken)

      // Save new tokens (only if not using httpOnly cookies)
      if (!tokenStorage.isUsingCookies()) {
        tokenStorage.setAccessToken(response.accessToken)
        tokenStorage.setRefreshToken(response.refreshToken)
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      get().logout()
    }
  },

  // Logout
  logout: async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear tokens
      tokenStorage.clearTokens()

      // Reset state
      set(initialState)

      toast.success('Logged out successfully')
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  },

  // Update user
  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user

    if (currentUser) {
      set({
        user: { ...currentUser, ...userData },
      })
    }
  },

  // State setters
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  setPendingEmail: (pendingEmail: string | null) => set({ pendingEmail }),
  reset: () => set(initialState),
})
