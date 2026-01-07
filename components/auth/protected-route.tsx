'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  requireAuth = true 
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo)
      } else if (!requireAuth && isAuthenticated) {
        router.push('/feed')
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting
  if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
    return null
  }

  return <>{children}</>
}
