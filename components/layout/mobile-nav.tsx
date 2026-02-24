'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Heart, User, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMessageStore } from '@/store/message.store'

export default function MobileNav() {
  const pathname = usePathname()
  const messageUnreadCount = useMessageStore((s) => s.unreadCount)

  const navItems = [
    { icon: Home, label: 'Home', href: '/feed' },
    { icon: Compass, label: 'Explore', href: '/explore' },
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
    { icon: Heart, label: 'Subs', href: '/subscriptions' },
    { icon: User, label: 'Profile', href: '/janedoe' },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href)
          const isMessages = item.href === '/messages'
          const showBadge = isMessages && messageUnreadCount > 0

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-1 text-[9px] font-bold text-white leading-none">
                    {messageUnreadCount > 99 ? '99+' : messageUnreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
