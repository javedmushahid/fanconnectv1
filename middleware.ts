import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js Middleware
 * Protects routes based on refreshToken cookie presence
 * 
 * Note: Only checks refreshToken (7 days)
 * Access token (1 min) expires quickly and is refreshed by frontend
 */

// Routes that require authentication
const protectedRoutes = [
  '/feed',
  '/stories',
  '/explore',
  '/subscriptions',
  '/saved',
  '/messages',
  '/notifications',
  '/settings',
  '/creator',
  '/analytics',
]

// Routes that redirect to feed if authenticated
const authRoutes = [
  '/login',
  '/register',
  '/verify-otp',
  '/forgot-password',
  '/reset-password',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check for refresh token (7-day token)
  const refreshToken = request.cookies.get('refreshToken')?.value
  const isAuthenticated = !!refreshToken

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/feed', request.url))
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Allow request to proceed
  return NextResponse.next()
}

// Configure middleware matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
