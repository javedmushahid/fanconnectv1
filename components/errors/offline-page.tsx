'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WifiOff, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function OfflinePage() {
  const router = useRouter()

  const handleRetry = () => {
    if (navigator.onLine) {
      router.refresh()
    } else {
      alert('Still offline. Please check your internet connection.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-background to-gray-50 dark:from-gray-950/20 dark:via-background dark:to-gray-950/20 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-12 pb-8 text-center">
          {/* Offline Illustration */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gray-500 blur-3xl opacity-20 animate-pulse" />
              <WifiOff className="relative h-32 w-32 text-gray-500" strokeWidth={1.5} />
            </div>
          </div>

          {/* Message */}
          <div className="mb-8 space-y-3">
            <h1 className="text-4xl font-bold">No Internet Connection</h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              It looks like you're offline. Please check your internet connection and try again.
            </p>
          </div>

          {/* Connection Status */}
          <div className="mb-8 p-4 bg-muted/50 rounded-lg max-w-sm mx-auto">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                Offline
              </span>
            </div>
          </div>

          {/* Retry Button */}
          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              size="lg"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Connection
            </Button>
          </div>

          {/* Tips */}
          <div className="mt-8 pt-8 border-t">
            <p className="text-sm font-medium mb-3">Troubleshooting Tips:</p>
            <ul className="text-sm text-muted-foreground text-left max-w-sm mx-auto space-y-2">
              <li>• Check your WiFi or mobile data connection</li>
              <li>• Make sure airplane mode is turned off</li>
              <li>• Try moving to a location with better signal</li>
              <li>• Restart your router if using WiFi</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
