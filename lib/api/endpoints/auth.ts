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
} from '@/types/auth.types'

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials)
    return data.data
  },

  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', credentials)
    return data.data
  },

  verifyOTP: async (payload: VerifyOTPPayload): Promise<VerifyOTPResponse> => {
    const { data } = await apiClient.post<ApiResponse<VerifyOTPResponse>>('/auth/verify-otp', payload)
    return data.data
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me')
    return data.data.user
  },

  // NEW: Refresh token endpoint
  refreshToken: async (): Promise<void> => {
    await apiClient.post('/auth/refresh-token')
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email })
  },
}
