'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { storiesAPI, StoryFeedItem } from '@/lib/api/endpoints/stories'
import { useAuthStore } from '@/store/auth.store'

export default function StoriesFeed() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [feedItems, setFeedItems] = useState<StoryFeedItem[]>([])
  const [myStories, setMyStories] = useState<StoryFeedItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    storiesAPI
      .getFeed()
      .then(({ stories }) => {
        if (user) {
          const mine = stories.find((s) => s.creator.id === user.id) ?? null
          const others = stories.filter((s) => s.creator.id !== user.id)
          setMyStories(mine)
          setFeedItems(others)
        } else {
          setFeedItems(stories)
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [user])

  const allItems: StoryFeedItem[] = myStories ? [myStories, ...feedItems] : feedItems

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Stories</h1>
        <p className="text-muted-foreground">Share moments with your followers</p>
      </div>

      {/* Story Rings — Horizontal Scroll */}
      <div className="relative -mx-4 px-4">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {/* Your Story */}
          <div
            onClick={() =>
              myStories ? router.push(`/stories/${user!.id}`) : router.push('/stories/create')
            }
            className="flex-none snap-start cursor-pointer"
          >
            <div className="flex flex-col items-center gap-2 w-20">
              <div className="relative">
                {myStories ? (
                  <div
                    className={`w-20 h-20 rounded-full p-0.5 ${
                      myStories.hasUnviewed
                        ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500'
                        : 'bg-muted-foreground/30'
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-background p-0.5">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={myStories.creator.avatar ?? undefined} />
                        <AvatarFallback>{myStories.creator.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full relative">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={user?.avatar ?? undefined} />
                      <AvatarFallback>{user?.username?.[0]?.toUpperCase() ?? '+'}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                      <Plus className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-center line-clamp-1">
                {myStories ? 'Your Story' : 'Create Story'}
              </span>
            </div>
          </div>

          {/* Loading skeletons */}
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-none snap-start">
                <div className="flex flex-col items-center gap-2 w-20">
                  <Skeleton className="w-20 h-20 rounded-full" />
                  <Skeleton className="h-3 w-14 rounded" />
                </div>
              </div>
            ))}

          {/* Following Stories */}
          {!isLoading &&
            feedItems.map((item) => (
              <div
                key={item.creator.id}
                onClick={() => router.push(`/stories/${item.creator.id}`)}
                className="flex-none snap-start cursor-pointer group"
              >
                <div className="flex flex-col items-center gap-2 w-20">
                  <div className="relative">
                    <div
                      className={`w-20 h-20 rounded-full p-0.5 ${
                        item.hasUnviewed
                          ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500'
                          : 'bg-muted-foreground/30'
                      }`}
                    >
                      <div className="w-full h-full rounded-full bg-background p-0.5">
                        <Avatar className="w-full h-full group-hover:scale-105 transition-transform">
                          <AvatarImage src={item.creator.avatar ?? undefined} />
                          <AvatarFallback>{item.creator.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-center line-clamp-1 w-full">
                    {item.creator.name}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Story Grid Preview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Stories</h2>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[9/16] rounded-xl" />
            ))}
          </div>
        )}

        {!isLoading && allItems.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">
            No stories yet. Follow people or create your own!
          </p>
        )}

        {!isLoading && allItems.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allItems.map((item) => {
              const firstStory = item.stories[0]
              if (!firstStory) return null
              return (
                <Card
                  key={item.creator.id}
                  onClick={() => router.push(`/stories/${item.creator.id}`)}
                  className="overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
                >
                  <CardContent className="p-0 relative">
                    <div className="aspect-[9/16] bg-black overflow-hidden">
                      <img
                        src={firstStory.thumbnailUrl ?? firstStory.mediaUrl}
                        alt={item.creator.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />

                      {/* User Info */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <Avatar className="h-8 w-8 ring-2 ring-white">
                          <AvatarImage src={item.creator.avatar ?? undefined} />
                          <AvatarFallback>{item.creator.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-white text-sm font-semibold drop-shadow">
                          {item.creator.name}
                        </span>
                      </div>

                      {/* Story Count */}
                      {item.stories.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                          <span className="text-white text-xs font-medium">
                            {item.stories.length} stories
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
