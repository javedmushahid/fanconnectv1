
'use client'

import Link from 'next/link'
import { Home, Compass, Heart, Bookmark, Settings, DollarSign, Users, Upload, TrendingUp, Film, BarChart3, MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useMessageStore } from '@/store/message.store'

export default function Sidebar() {
  const pathname = usePathname()
  const messageUnreadCount = useMessageStore((s) => s.unreadCount)

  // Set this to true to show Creator Studio after using states and other things
  const isCreator = true

  const navItems = [
    { icon: Home, label: 'Feed', href: '/feed' },
    { icon: Film, label: 'Stories', href: '/stories' },
    { icon: Compass, label: 'Explore', href: '/explore' },
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
    { icon: Bookmark, label: 'Saved', href: '/saved' },
    { icon: Heart, label: 'Subscriptions', href: '/subscriptions' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  const creatorItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/creator/dashboard' },
    { icon: TrendingUp, label: 'Analytics', href: '/analytics/overview' },
    { icon: Upload, label: 'Upload', href: '/creator/upload' },
    { icon: DollarSign, label: 'Earnings', href: '/creator/earnings' },
    { icon: Users, label: 'Subscribers', href: '/creator/subscribers' },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-r bg-background h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex-1 overflow-y-auto py-6 px-3">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const isMessages = item.href === '/messages'
            const showBadge = isMessages && messageUnreadCount > 0

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
                  <span className="font-medium flex-1">{item.label}</span>
                  {showBadge && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-1 text-[11px] font-semibold text-white">
                      {messageUnreadCount > 99 ? '99+' : messageUnreadCount}
                    </span>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Creator Studio Section */}
        {isCreator && (
          <div className="mt-8">
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Creator Studio
            </h3>
            <nav className="space-y-1">
              {creatorItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href)

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

        {/* Become a Creator Card - Only show when NOT a creator */}
        {!isCreator && (
          <Link href="/creator/onboarding">
            <Card className="mt-8 p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 cursor-pointer hover:shadow-lg transition-shadow">
              <h3 className="font-bold mb-2 text-lg">Become a Creator</h3>
              <p className="text-sm mb-4 opacity-90">
                Start earning from your content today
              </p>
              <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                Get Started
              </Button>
            </Card>
          </Link>
        )}
      </div>
    </aside>
  )
}
