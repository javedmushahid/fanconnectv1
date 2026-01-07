import apiClient from './client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  username: string
  displayName: string
}

export interface VerifyOTPPayload {
  email: string
  otp: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    username: string
    displayName: string
    avatar?: string
  }
  accessToken: string
  refreshToken: string
}

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  // Register
  async register(credentials: RegisterCredentials): Promise<{ message: string; email: string }> {
    const response = await apiClient.post('/auth/register', credentials)
    return response.data
  },

  // Verify OTP
  async verifyOTP(payload: VerifyOTPPayload): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/verify-otp', payload)
    return response.data
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken })
    return response.data
  },

  // Logout
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  // Get current user
  async getCurrentUser() {
    const response = await apiClient.get('/auth/me')
    return response.data
  },
}
