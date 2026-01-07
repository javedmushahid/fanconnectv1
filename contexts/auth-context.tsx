'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService, AuthResponse } from '@/lib/api/auth.service'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string, displayName: string) => Promise<void>
  verifyOTP: (email: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  pendingEmail: string | null
  setPendingEmail: (email: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const router = useRouter()

  const isAuthenticated = !!user

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      
      if (!accessToken) {
        setIsLoading(false)
        return
      }

      // Verify token and get user
      const userData = await authService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      
      // Save tokens
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      // Set user
      setUser(response.user)
      
      toast.success('Login successful!')
      router.push('/feed')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => {
    try {
      const response = await authService.register({
        email,
        password,
        username,
        displayName,
      })
      
      setPendingEmail(email)
      toast.success('OTP sent to your email!')
      router.push('/verify-otp')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await authService.verifyOTP({ email, otp })
      
      // Save tokens
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      // Set user
      setUser(response.user)
      setPendingEmail(null)
      
      toast.success('Account verified successfully!')
      router.push('/feed')
    } catch (error: any) {
      const message = error.response?.data?.message || 'OTP verification failed'
      toast.error(message)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear tokens and user
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      
      toast.success('Logged out successfully')
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        verifyOTP,
        logout,
        pendingEmail,
        setPendingEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
