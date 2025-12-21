'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Crown, Shield, Star } from 'lucide-react'

interface ViewersModalProps {
  open: boolean
  onClose: () => void
  viewers: number
}

interface Viewer {
  id: string
  username: string
  displayName: string
  avatar: string
  badge?: 'subscriber' | 'moderator' | 'vip'
  watchTime: number // in minutes
}

// Mock viewers data
const MOCK_VIEWERS: Viewer[] = [
  {
    id: '1',
    username: 'fitnessaddict',
    displayName: 'Fitness Addict',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessAddict',
    badge: 'vip',
    watchTime: 45,
  },
  {
    id: '2',
    username: 'gymrat',
    displayName: 'Gym Rat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GymRat',
    badge: 'subscriber',
    watchTime: 38,
  },
  {
    id: '3',
    username: 'healthygirl',
    displayName: 'Healthy Girl',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HealthyGirl',
    badge: 'subscriber',
    watchTime: 30,
  },
  {
    id: '4',
    username: 'strongman',
    displayName: 'Strong Man',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StrongMan',
    badge: 'moderator',
    watchTime: 45,
  },
  {
    id: '5',
    username: 'yogalover',
    displayName: 'Yoga Lover',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=YogaLover',
    watchTime: 25,
  },
  {
    id: '6',
    username: 'athlete123',
    displayName: 'Athlete',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Athlete',
    badge: 'subscriber',
    watchTime: 20,
  },
  {
    id: '7',
    username: 'runner',
    displayName: 'Marathon Runner',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Runner',
    watchTime: 15,
  },
  {
    id: '8',
    username: 'newbie',
    displayName: 'Just Started',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Newbie',
    watchTime: 5,
  },
]

export default function ViewersModal({ open, onClose, viewers }: ViewersModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewersList] = useState<Viewer[]>(MOCK_VIEWERS)

  const filteredViewers = viewersList.filter((viewer) =>
    viewer.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    viewer.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'vip':
        return <Crown className="h-3 w-3" />
      case 'moderator':
        return <Shield className="h-3 w-3" />
      case 'subscriber':
        return <Star className="h-3 w-3" />
      default:
        return null
    }
  }

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'subscriber':
        return 'bg-blue-500'
      case 'moderator':
        return 'bg-green-500'
      case 'vip':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getBadgeLabel = (badge?: string) => {
    switch (badge) {
      case 'subscriber':
        return 'Subscriber'
      case 'moderator':
        return 'Moderator'
      case 'vip':
        return 'VIP'
      default:
        return ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Live Viewers</DialogTitle>
          <DialogDescription>
            {viewers.toLocaleString()} people watching right now
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search viewers..."
            className="pl-9"
          />
        </div>

        {/* Viewers List */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {filteredViewers.map((viewer) => (
              <div
                key={viewer.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={viewer.avatar} />
                    <AvatarFallback>{viewer.displayName[0]}</AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">
                        {viewer.displayName}
                      </p>
                      {viewer.badge && (
                        <Badge
                          className={`${getBadgeColor(viewer.badge)} text-white text-[10px] px-1.5 py-0 h-4 flex items-center gap-1`}
                        >
                          {getBadgeIcon(viewer.badge)}
                          <span className="hidden sm:inline">{getBadgeLabel(viewer.badge)}</span>
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      @{viewer.username} • Watching {viewer.watchTime}m
                    </p>
                  </div>
                </div>

                {/* Action */}
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  View
                </Button>
              </div>
            ))}

            {filteredViewers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No viewers found</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t text-sm">
          <div className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {viewersList.filter((v) => v.badge === 'subscriber').length}
            </span>{' '}
            Subscribers
          </div>
          <div className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {viewersList.filter((v) => v.badge === 'vip').length}
            </span>{' '}
            VIP
          </div>
          <div className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {viewersList.filter((v) => v.badge === 'moderator').length}
            </span>{' '}
            Moderators
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
