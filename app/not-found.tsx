import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-3xl opacity-20" />
              <h1 className="relative text-9xl font-bold text-primary">404</h1>
            </div>
          </div>

          <div className="mb-8 space-y-3">
            <h2 className="text-3xl font-bold">Page Not Found</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/feed">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                <Search className="h-4 w-4" />
                Explore
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
