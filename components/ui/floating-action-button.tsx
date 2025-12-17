'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'

export default function FloatingActionButton() {
  const pathname = usePathname()
  
  // Don't show on upload or auth pages
  if (pathname?.includes('/upload') || pathname?.includes('/login') || pathname?.includes('/signup')) {
    return null
  }

  return (
    <Link href="/creator/upload">
      <Button
        size="lg"
        className="fixed bottom-20 right-6 lg:bottom-8 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 pulse-glow z-40 group"
      >
        <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
      </Button>
    </Link>
  )
}
