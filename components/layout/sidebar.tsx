'use client'

import Link from 'next/link'
import { Home, Compass, Heart, Bookmark, Settings, DollarSign, Users, Upload, TrendingUp } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const pathname = usePathname()
  const isCreator = true

  const navItems = [
    { icon: Home, label: 'Feed', href: '/feed' },
    { icon: Compass, label: 'Explore', href: '/explore' },
    { icon: Bookmark, label: 'Saved', href: '/saved' },
    { icon: Heart, label: 'Subscriptions', href: '/subscriptions' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  const creatorItems = [
    { icon: Upload, label: 'Upload', href: '/creator/upload' },
    { icon: DollarSign, label: 'Earnings', href: '/creator/earnings' },
    { icon: Users, label: 'Subscribers', href: '/creator/subscribers' },
    { icon: TrendingUp, label: 'Analytics', href: '/creator/dashboard' },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-r bg-background h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-secondary"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>

        {isCreator && (
          <div className="mt-8">
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Creator Studio
            </h3>
            <nav className="space-y-1">
              {creatorItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive && "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}

        {!isCreator && (
          <Card className="mt-8 p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
            <h3 className="font-bold mb-2 text-lg">Become a Creator</h3>
            <p className="text-sm mb-4 opacity-90">
              Start earning from your content today
            </p>
            <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
              Get Started
            </Button>
          </Card>
        )}
      </div>
    </aside>
  )
}
