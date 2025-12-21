'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, FileText } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
    // You can log to error reporting service here
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardContent className="pt-12 pb-8 text-center">
              {/* Error Icon */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-destructive blur-3xl opacity-20 animate-pulse" />
                  <AlertTriangle className="relative h-24 w-24 text-destructive" strokeWidth={1.5} />
                </div>
              </div>

              {/* Error Message */}
              <div className="mb-8 space-y-3">
                <h1 className="text-3xl font-bold">Something went wrong</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We encountered an unexpected error. This has been reported to our team.
                </p>
              </div>

              {/* Error Details */}
              {this.state.error && (
                <div className="mb-8 p-4 bg-muted/50 rounded-lg text-left max-w-lg mx-auto">
                  <p className="text-xs text-muted-foreground mb-2">Error Details:</p>
                  <code className="text-xs block text-destructive">
                    {this.state.error.message}
                  </code>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => this.setState({ hasError: false, error: null })}
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
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={() => {
                    const errorReport = {
                      message: this.state.error?.message,
                      stack: this.state.error?.stack,
                      timestamp: new Date().toISOString(),
                    }
                    console.log('Error Report:', errorReport)
                    alert('Error reported. Thank you!')
                  }}
                >
                  <FileText className="h-4 w-4" />
                  Report Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
