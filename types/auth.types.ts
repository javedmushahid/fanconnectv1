// User interface
export interface User {
  id: string
  email: string
  username: string
  name: string
  bio?: string
  avatar: string | null
  banner?: string | null
  role: 'USER' | 'CREATOR' | 'ADMIN'
  isEmailVerified: boolean
  createdAt: string
}

// API request types
export interface LoginCredentials {
  emailOrUsername: string
  password: string
}

export interface RegisterCredentials {
  email: string
  username: string
  password: string
  name: string
}

export interface VerifyOTPPayload {
  email: string
  otp: string
}

export interface ResetPasswordPayload {
  email: string
  otp: string
  newPassword: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

// API response types (matches your backend)
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface LoginResponse {
  user: User
}

export interface RegisterResponse {
  message: string
}

export interface VerifyOTPResponse {
  message: string
  user: User
}

// Zustand store types
export interface AuthState {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null
}

export interface AuthActions {
  // Auth actions
  login: (credentials: LoginCredentials) => Promise<User>
  register: (credentials: RegisterCredentials) => Promise<void>
  verifyOTP: (payload: VerifyOTPPayload) => Promise<User>
  logout: () => Promise<void>
  
  // State setters
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  setError: (error: string | null) => void
  
  // Reset
  reset: () => void
}

export type AuthStore = AuthState & AuthActions
