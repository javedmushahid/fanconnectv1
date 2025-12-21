'use client'

import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const MOCK_LIVE_STREAMS = [
  {
    id: 'stream1',
    title: 'Morning Workout Routine 🔥',
    creator: {
      name: 'Fitness Guru',
      username: 'fitnessguru',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessGuru',
    },
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=225&fit=crop',
    viewers: 1247,
    category: 'Fitness',
  },
  {
    id: 'stream2',
    title: 'Live Cooking: Italian Pasta 🍝',
    creator: {
      name: 'Chef Maria',
      username: 'chefmaria',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    },
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=225&fit=crop',
    viewers: 856,
    category: 'Cooking',
  },
  {
    id: 'stream3',
    title: 'Digital Art Tutorial - Landscape',
    creator: {
      name: 'Art by Alex',
      username: 'artbyalex',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=225&fit=crop',
    viewers: 623,
    category: 'Art',
  },
  {
    id: 'stream4',
    title: 'Gaming: Fortnite Tournament',
    creator: {
      name: 'Pro Gamer',
      username: 'progamer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gamer',
    },
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop',
    viewers: 2341,
    category: 'Gaming',
  },
]

export default function LiveNowSection() {
  if (MOCK_LIVE_STREAMS.length === 0) return null

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <h2 className="text-lg font-bold">Live Now</h2>
          <Badge className="bg-red-600 text-white text-xs">
            {MOCK_LIVE_STREAMS.length}
          </Badge>
        </div>
        <Link href="/explore?tab=live">
          <Button variant="ghost" size="sm" className="gap-1 text-xs h-8">
            View All
            <ChevronRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Horizontal Scroll */}
      <div className="overflow-x-scroll no-scrollbar -mx-4 px-4">
        <div className="flex gap-4 w-max pb-2">
          {MOCK_LIVE_STREAMS.map((stream) => (
            <Link
              key={stream.id}
              href={`/streaming/${stream.id}`}
              className="flex-shrink-0 w-64"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={stream.thumbnail}
                    alt={stream.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Live Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-600 text-white px-2 py-1 text-xs font-semibold animate-pulse">
                      🔴 LIVE
                    </Badge>
                  </div>

                  {/* Viewers Count */}
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 text-xs">
                      <Users className="h-3 w-3 mr-1 inline" />
                      {stream.viewers.toLocaleString()}
                    </Badge>
                  </div>

                  {/* Category */}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs px-2 py-1">
                      {stream.category}
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 space-y-2">
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {stream.title}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={stream.creator.avatar} />
                      <AvatarFallback className="text-xs">{stream.creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate">
                      {stream.creator.name}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
