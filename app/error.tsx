'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-orange-50 dark:from-red-950/20 dark:via-background dark:to-orange-950/20 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-3xl opacity-20 animate-pulse" />
              <AlertTriangle className="relative h-32 w-32 text-red-500" strokeWidth={1.5} />
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">Oops! Something went wrong</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              An unexpected error occurred. Don't worry, our team has been notified.
            </p>
          </div>

          {error.message && (
            <div className="mb-8 p-4 bg-muted/50 rounded-lg text-left max-w-md mx-auto">
              <p className="text-xs text-muted-foreground mb-2">Error Message:</p>
              <code className="text-sm text-red-600 dark:text-red-400">
                {error.message}
              </code>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} size="lg" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Link href="/feed">
              <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
