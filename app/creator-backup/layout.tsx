import Navbar from '@/components/layout/navbar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Upload, DollarSign, Users } from 'lucide-react'

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Creator Navigation */}
      <div className="border-b bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto">
            <Link href="/creator/dashboard">
              <Button variant="ghost" size="sm">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/creator/upload">
              <Button variant="ghost" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </Link>
            <Link href="/creator/earnings">
              <Button variant="ghost" size="sm">
                <DollarSign className="mr-2 h-4 w-4" />
                Earnings
              </Button>
            </Link>
            <Link href="/creator/subscribers">
              <Button variant="ghost" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Subscribers
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
