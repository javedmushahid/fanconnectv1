'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean // true = need to be logged in, false = need to be logged out
}

/**
 * Protected Route Component
 * Handles both protected pages and auth pages
 */
export function ProtectedRoute({ 
  children, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isInitialized } = useAuth()

  useEffect(() => {
    // Wait for auth to initialize
    if (!isInitialized) return

    // If page needs auth but user not logged in → redirect to login
    if (requireAuth && !isAuthenticated) {
      router.push('/login')
    }

    // If page needs NO auth (login/register) but user IS logged in → redirect to feed
    if (!requireAuth && isAuthenticated) {
      router.push('/feed')
    }
  }, [isInitialized, isAuthenticated, requireAuth, router])

  // Show loading while checking auth
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Wrong auth state, show nothing (redirecting)
  if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
    return null
  }

  // Correct auth state, show content
  return <>{children}</>
}
