
export interface User {
  id: string
  email: string
  username: string
  name: string // Changed from displayName
  avatar: string | null
  role: 'USER' | 'CREATOR' | 'ADMIN'
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

// API Response structure
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

export interface RegisterResponse {
  message: string
  email: string
}

export interface VerifyOTPResponse {
  user: User
  tokens: AuthTokens
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  username: string
  name: string // Changed from displayName
}

export interface VerifyOTPPayload {
  email: string
  otp: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  pendingEmail: string | null
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  verifyOTP: (payload: VerifyOTPPayload) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setPendingEmail: (email: string | null) => void
  reset: () => void
}

export type AuthStore = AuthState & AuthActions
