
import apiClient from '../client'
import {
  LoginCredentials,
  RegisterCredentials,
  VerifyOTPPayload,
  User,
  ApiResponse,
  LoginResponse,
  RegisterResponse,
  VerifyOTPResponse,
  RefreshTokenResponse,
} from '@/types/auth.types'

export const authAPI = {
  // Login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials)
    return data.data
  },

  // Register
  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', credentials)
    return data.data
  },

  // Verify OTP
  verifyOTP: async (payload: VerifyOTPPayload): Promise<VerifyOTPResponse> => {
    const { data } = await apiClient.post<ApiResponse<VerifyOTPResponse>>('/auth/verify-otp', payload)
    return data.data
  },

  // Resend OTP
  resendOTP: async (email: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>('/auth/resend-otp', { email })
    return data.data
  },

  // Forgot Password
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email })
    return data.data
  },

  // Reset Password
  resetPassword: async (payload: { email: string; otp: string; newPassword: string }): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', payload)
    return data.data
  },

  // Change Password
  changePassword: async (payload: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>('/auth/change-password', payload)
    return data.data
  },

  // Refresh Token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const { data } = await apiClient.post<ApiResponse<{ tokens: RefreshTokenResponse }>>('/auth/refresh-token', {
      refreshToken,
    })
    return data.data.tokens
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me')
    return data.data.user
  },
}
