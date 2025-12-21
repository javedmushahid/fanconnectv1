'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Home, RefreshCw, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ErrorPage500() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-orange-50 dark:from-red-950/20 dark:via-background dark:to-orange-950/20 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-8 text-center">
          {/* Error Illustration */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-3xl opacity-20 animate-pulse" />
              <AlertCircle className="relative h-32 w-32 text-red-500" strokeWidth={1.5} />
            </div>
          </div>

          {/* Error Code */}
          <div className="mb-6">
            <h1 className="text-8xl font-bold text-red-500 mb-2">500</h1>
            <div className="inline-block px-4 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
              <code className="text-sm text-red-700 dark:text-red-300 font-mono">
                INTERNAL_SERVER_ERROR
              </code>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-2">
            <h2 className="text-3xl font-bold">Oops! Something went wrong</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're experiencing technical difficulties. Our team has been notified 
              and is working to fix the issue.
            </p>
          </div>

          {/* Error Details (Optional - for dev) */}
          <div className="mb-8 p-4 bg-muted/50 rounded-lg text-left max-w-md mx-auto">
            <p className="text-xs text-muted-foreground mb-2">Error Details:</p>
            <code className="text-xs block">
              Timestamp: {new Date().toISOString()}<br />
              Request ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </code>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.refresh()}
              className="gap-2"
              size="lg"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Link href="/feed">
              <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                <Mail className="h-4 w-4" />
                Contact Support
              </Button>
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              If the problem persists, please{' '}
              <Link href="/support" className="text-primary hover:underline">
                contact our support team
              </Link>
              {' '}with the error code above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
