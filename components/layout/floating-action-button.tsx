'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, X, Image, Video, FileText } from 'lucide-react'
import Link from 'next/link'

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-20 right-4 z-40 lg:hidden">
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-2 animate-in slide-in-from-bottom">
          <Link href="/creator/upload">
            <Button
              size="sm"
              className="w-full gap-2 shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              <Image className="h-4 w-4" />
              Upload Photo
            </Button>
          </Link>
          <Link href="/creator/upload">
            <Button
              size="sm"
              className="w-full gap-2 shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              <Video className="h-4 w-4" />
              Upload Video
            </Button>
          </Link>
          <Link href="/stories/create">
            <Button
              size="sm"
              className="w-full gap-2 shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              <FileText className="h-4 w-4" />
              Create Story
            </Button>
          </Link>
        </div>
      )}

      {/* Main FAB */}
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </Button>
    </div>
  )
}
