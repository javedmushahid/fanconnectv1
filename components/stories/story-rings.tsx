'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storiesAPI, StoryFeedItem } from '@/lib/api/endpoints/stories'
import { useAuthStore } from '@/store/auth.store'

export default function StoryRings() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [feedItems, setFeedItems] = useState<StoryFeedItem[]>([])
  const [myStories, setMyStories] = useState<StoryFeedItem | null>(null)

  useEffect(() => {
    storiesAPI.getFeed().then(({ stories }) => {
      if (!user) {
        setFeedItems(stories)
        return
      }
      const mine = stories.find((s) => s.creator.id === user.id) ?? null
      const others = stories.filter((s) => s.creator.id !== user.id)
      setMyStories(mine)
      setFeedItems(others)
    }).catch(() => {
      // silently fail – feed still works without stories
    })
  }, [user])

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Your Story ring */}
        {myStories ? (
          <button
            onClick={() => router.push(`/stories/${user!.id}`)}
            className="flex-none snap-start"
          >
            <div className="flex flex-col items-center gap-2 w-20">
              <div
                className={`w-20 h-20 rounded-full p-[3px] ${
                  myStories.hasUnviewed
                    ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500'
                    : 'bg-muted-foreground/30'
                }`}
              >
                <div className="w-full h-full rounded-full bg-background p-[2px]">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={myStories.creator.avatar ?? undefined} />
                    <AvatarFallback>{myStories.creator.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className="text-xs font-medium text-center line-clamp-1 w-full">
                Your Story
              </span>
            </div>
          </button>
        ) : (
          <Link href="/stories/create" className="flex-none snap-start">
            <div className="flex flex-col items-center gap-2 w-20">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors">
                <Plus className="h-7 w-7 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium text-center line-clamp-1 w-full">
                Your Story
              </span>
            </div>
          </Link>
        )}

        {/* Following Stories */}
        {feedItems.map((item) => (
          <button
            key={item.creator.id}
            onClick={() => router.push(`/stories/${item.creator.id}`)}
            className="flex-none snap-start"
          >
            <div className="flex flex-col items-center gap-2 w-20">
              <div
                className={`w-20 h-20 rounded-full p-[3px] ${
                  item.hasUnviewed
                    ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500'
                    : 'bg-muted-foreground/30'
                }`}
              >
                <div className="w-full h-full rounded-full bg-background p-[2px]">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={item.creator.avatar ?? undefined} />
                    <AvatarFallback>{item.creator.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className="text-xs font-medium text-center line-clamp-1 w-full">
                {item.creator.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
