import apiClient from '../client'
import {
  LoginCredentials,
  RegisterCredentials,
  VerifyOTPPayload,
  User,
  AuthTokens,
} from '@/types/auth.types'

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RegisterResponse {
  message: string
  email: string
}

export interface VerifyOTPResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export const authAPI = {
  // Login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials)
    return data
  },

  // Register
  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<RegisterResponse>('/auth/register', credentials)
    return data
  },

  // Verify OTP
  verifyOTP: async (payload: VerifyOTPPayload): Promise<VerifyOTPResponse> => {
    const { data } = await apiClient.post<VerifyOTPResponse>('/auth/verify-otp', payload)
    return data
  },

  // Refresh Token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const { data } = await apiClient.post<RefreshTokenResponse>('/auth/refresh-token', {
      refreshToken,
    })
    return data
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me')
    return data
  },

  // Resend OTP
  resendOTP: async (email: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/resend-otp', { email })
    return data
  },
}
