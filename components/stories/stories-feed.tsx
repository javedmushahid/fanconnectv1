'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Play, Camera } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const MOCK_STORIES = [
  {
    userId: 'user1',
    username: 'fitnessguru',
    displayName: 'Fitness Guru',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessGuru',
    hasUnseenStories: true,
    stories: [
      {
        id: 'story1',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=700&fit=crop',
        timestamp: Date.now() - 3600000,
      },
      {
        id: 'story2',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=700&fit=crop',
        timestamp: Date.now() - 1800000,
      },
    ],
  },
  {
    userId: 'user2',
    username: 'chefmaria',
    displayName: 'Chef Maria',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    hasUnseenStories: true,
    stories: [
      {
        id: 'story3',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=700&fit=crop',
        timestamp: Date.now() - 7200000,
      },
    ],
  },
  {
    userId: 'user3',
    username: 'artbyalex',
    displayName: 'Art by Alex',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    hasUnseenStories: false,
    stories: [
      {
        id: 'story4',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=700&fit=crop',
        timestamp: Date.now() - 14400000,
      },
    ],
  },
  {
    userId: 'user4',
    username: 'musiclover',
    displayName: 'Music Lover',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Music',
    hasUnseenStories: true,
    stories: [
      {
        id: 'story5',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=700&fit=crop',
        timestamp: Date.now() - 900000,
      },
    ],
  },
]

// Mock user's current story
const MY_STORY = {
  userId: 'janedoe',
  username: 'janedoe',
  displayName: 'Jane Doe',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  hasActiveStory: false, // Change to true to show active story
  stories: [],
}

export default function StoriesFeed() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Stories</h1>
        <p className="text-muted-foreground">
          Share moments with your followers
        </p>
      </div>

      {/* Story Rings - Horizontal Scroll */}
      <div className="relative -mx-4 px-4">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {/* Your Story */}
          <div
            onClick={() => router.push('/stories/create')}
            className="flex-none snap-start cursor-pointer"
          >
            <div className="flex flex-col items-center gap-2 w-20">
              <div className="relative">
                {MY_STORY.hasActiveStory ? (
                  // Active Story
                  <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500">
                    <div className="w-full h-full rounded-full bg-background p-0.5">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={MY_STORY.avatar} />
                        <AvatarFallback>{MY_STORY.displayName[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                ) : (
                  // Create New Story
                  <div className="w-20 h-20 rounded-full relative">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={MY_STORY.avatar} />
                      <AvatarFallback>{MY_STORY.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                      <Plus className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-center line-clamp-1">
                {MY_STORY.hasActiveStory ? 'Your Story' : 'Create Story'}
              </span>
            </div>
          </div>

          {/* Following Stories */}
          {MOCK_STORIES.map((story) => (
            <div
              key={story.userId}
              onClick={() => router.push(`/stories/${story.userId}`)}
              className="flex-none snap-start cursor-pointer group"
            >
              <div className="flex flex-col items-center gap-2 w-20">
                <div className="relative">
                  {/* Story Ring */}
                  <div
                    className={`w-20 h-20 rounded-full p-0.5 ${
                      story.hasUnseenStories
                        ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500'
                        : 'bg-muted-foreground/30'
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-background p-0.5">
                      <Avatar className="w-full h-full group-hover:scale-105 transition-transform">
                        <AvatarImage src={story.avatar} />
                        <AvatarFallback>{story.displayName[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  {/* Play Icon for Multiple Stories */}
                  {story.stories.length > 1 && (
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                      <Play className="h-3 w-3 text-primary-foreground fill-current ml-0.5" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-center line-clamp-1 w-full">
                  {story.displayName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Grid Preview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Stories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {MOCK_STORIES.map((story) => (
            <Card
              key={story.userId}
              onClick={() => router.push(`/stories/${story.userId}`)}
              className="overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
            >
              <CardContent className="p-0 relative">
                <div className="aspect-[9/16] bg-black overflow-hidden">
                  <img
                    src={story.stories[0].url}
                    alt={story.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />

                  {/* User Info */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Avatar className="h-8 w-8 ring-2 ring-white">
                      <AvatarImage src={story.avatar} />
                      <AvatarFallback>{story.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-white text-sm font-semibold drop-shadow">
                      {story.displayName}
                    </span>
                  </div>

                  {/* Story Count */}
                  {story.stories.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-white text-xs font-medium">
                        {story.stories.length} stories
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
