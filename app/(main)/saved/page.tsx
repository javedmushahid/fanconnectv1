'use client'

import { Bookmark } from 'lucide-react'
import EmptyState from '@/components/ui/empty-state'
import { useRouter } from 'next/navigation'

export default function SavedPage() {
  const router = useRouter()
  const hasSavedPosts = false // Set to true when user has saved posts

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Saved Posts</h1>
        <p className="text-muted-foreground">Posts you've bookmarked for later</p>
      </div>

      {!hasSavedPosts && (
        <EmptyState
          icon={Bookmark}
          title="No Saved Posts"
          description="You haven't saved any posts yet. Click the bookmark icon on posts to save them here for easy access later!"
          actionLabel="Browse Feed"
          onAction={() => router.push('/feed')}
          gradient="from-amber-500 to-orange-500"
        />
      )}
    </div>
  )
}
