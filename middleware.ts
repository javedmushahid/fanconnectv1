import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
  '/subscribe',
  '/checkout',
]

// Routes that should redirect to feed if already authenticated
const authRoutes = ['/login', '/register', '/verify-otp']

// Public routes that don't require authentication
const publicRoutes = ['/', '/about', '/help', '/terms', '/privacy']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get token from cookies or headers
  const accessToken = request.cookies.get('accessToken')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '')

  const isAuthenticated = !!accessToken

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(pathname)

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

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
