import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-7xl font-bold text-muted-foreground">404</p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <Button className="w-full">Go Home</Button>
            </Link>
            <Link href="/feed" className="flex-1">
              <Button variant="outline" className="w-full">View Feed</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
