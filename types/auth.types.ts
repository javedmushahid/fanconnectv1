export interface User {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
  isVerified: boolean
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  emailOrUsername: string
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

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  pendingEmail: string | null
}

export interface AuthActions {
  // Auth actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  verifyOTP: (payload: VerifyOTPPayload) => Promise<void>
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<void>
  
  // User actions
  updateUser: (user: Partial<User>) => void
  
  // State setters
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setPendingEmail: (email: string | null) => void
  reset: () => void
}

export type AuthStore = AuthState & AuthActions
