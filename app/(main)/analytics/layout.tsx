'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ANALYTICS_TABS = [
  { label: 'Overview', href: '/analytics/overview' },
  { label: 'Audience', href: '/analytics/audience' },
  { label: 'Content', href: '/analytics/content' },
  { label: 'Revenue', href: '/analytics/revenue' },
]

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="border-b overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {ANALYTICS_TABS.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link key={tab.href} href={tab.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'rounded-none border-b-2 border-transparent px-4 h-12',
                    isActive && 'border-primary text-primary font-semibold'
                  )}
                >
                  {tab.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Page Content */}
      {children}
    </div>
  )
}
