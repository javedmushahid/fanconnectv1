'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const MOCK_STORIES = [
  {
    userId: 'user1',
    username: 'fitnessguru',
    displayName: 'Fitness Guru',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessGuru',
    hasUnseenStories: true,
  },
  {
    userId: 'user2',
    username: 'chefmaria',
    displayName: 'Chef Maria',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    hasUnseenStories: true,
  },
  {
    userId: 'user3',
    username: 'artbyalex',
    displayName: 'Art by Alex',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    hasUnseenStories: false,
  },
  {
    userId: 'user4',
    username: 'musiclover',
    displayName: 'Music Lover',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Music',
    hasUnseenStories: true,
  },
  {
    userId: 'user5',
    username: 'techguru',
    displayName: 'Tech Guru',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
    hasUnseenStories: true,
  },
  {
    userId: 'user6',
    username: 'fashionista',
    displayName: 'Fashionista',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fashion',
    hasUnseenStories: true,
  },
  {
    userId: 'user7',
    username: 'traveler',
    displayName: 'Traveler',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Travel',
    hasUnseenStories: true,
  },
]

export default function StoryRings() {
  const router = useRouter()

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Your Story */}
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

        {/* Following Stories */}
        {MOCK_STORIES.map((story) => (
          <button
            key={story.userId}
            onClick={() => router.push(`/stories/${story.userId}`)}
            className="flex-none snap-start"
          >
            <div className="flex flex-col items-center gap-2 w-20">
              <div
                className={`w-20 h-20 rounded-full p-[3px] ${
                  story.hasUnseenStories
                    ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500'
                    : 'bg-muted-foreground/30'
                }`}
              >
                <div className="w-full h-full rounded-full bg-background p-[2px]">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={story.avatar} />
                    <AvatarFallback>{story.displayName[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className="text-xs font-medium text-center line-clamp-1 w-full">
                {story.displayName}
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
