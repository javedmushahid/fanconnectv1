'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  Heart,
  Smile,
  MoreVertical,
  Volume2,
  VolumeX,
  Flag,
  Ban,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Story {
  id: string
  type: 'image' | 'video'
  url: string
  timestamp: number
  views?: number
}

interface StoryViewerProps {
  userId: string
}

const MOCK_USER_STORIES: Record<string, any> = {
  user1: {
    username: 'fitnessguru',
    displayName: 'Fitness Guru',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessGuru',
    stories: [
      {
        id: 'story1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1080&h=1920&fit=crop',
        timestamp: Date.now() - 3600000,
        views: 234,
      },
      {
        id: 'story2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1080&h=1920&fit=crop',
        timestamp: Date.now() - 1800000,
        views: 156,
      },
    ],
  },
  user2: {
    username: 'chefmaria',
    displayName: 'Chef Maria',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    stories: [
      {
        id: 'story3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1080&h=1920&fit=crop',
        timestamp: Date.now() - 7200000,
        views: 89,
      },
    ],
  },
}

const QUICK_REACTIONS = ['❤️', '😂', '😮', '😢', '👏', '🔥']

export default function StoryViewer({ userId }: StoryViewerProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [replyText, setReplyText] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const progressInterval = useRef<NodeJS.Timeout>()
  const pauseTimeout = useRef<NodeJS.Timeout>()

  const userData = MOCK_USER_STORIES[userId] || MOCK_USER_STORIES.user1
  const stories = userData.stories as Story[]
  const currentStory = stories[currentIndex]

  // Auto-advance timer (5 seconds per story)
  useEffect(() => {
    if (isPaused) return

    const duration = 5000 // 5 seconds
    const interval = 50 // Update every 50ms
    const increment = (interval / duration) * 100

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext()
          return 0
        }
        return prev + increment
      })
    }, interval)

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [currentIndex, isPaused])

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setProgress(0)
    } else {
      // End of stories, go back to feed
      router.push('/stories')
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setProgress(0)
    }
  }

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    if (x < width / 3) {
      handlePrevious()
    } else if (x > (width * 2) / 3) {
      handleNext()
    }
  }

  const handleHold = (holding: boolean) => {
    if (holding) {
      setIsPaused(true)
      if (pauseTimeout.current) clearTimeout(pauseTimeout.current)
    } else {
      pauseTimeout.current = setTimeout(() => {
        setIsPaused(false)
      }, 100)
    }
  }

  const handleReaction = (emoji: string) => {
    toast.success(`Reacted with ${emoji}`)
    // Send reaction to creator
  }

  const handleReply = () => {
    if (!replyText.trim()) return
    toast.success('Reply sent!')
    setReplyText('')
    // Send DM to creator
  }

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Main Story Container */}
      <div className="relative w-full h-full max-w-lg mx-auto">
        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3">
          {stories.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm"
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-100"
                style={{
                  width:
                    index < currentIndex
                      ? '100%'
                      : index === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-12 left-0 right-0 z-20 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-white">
              <AvatarImage src={userData.avatar} />
              <AvatarFallback>{userData.displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-semibold text-sm drop-shadow">
                {userData.displayName}
              </p>
              <p className="text-white/80 text-xs drop-shadow">
                {getTimeAgo(currentStory.timestamp)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-sm text-white border-white/20">
                <DropdownMenuItem className="text-white focus:bg-white/20 focus:text-white">
                  <Flag className="h-4 w-4 mr-2" />
                  Report Story
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:bg-destructive/20 focus:text-destructive">
                  <Ban className="h-4 w-4 mr-2" />
                  Block User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => router.push('/stories')}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Story Content */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          onClick={handleTap}
          onMouseDown={() => handleHold(true)}
          onMouseUp={() => handleHold(false)}
          onMouseLeave={() => handleHold(false)}
          onTouchStart={() => handleHold(true)}
          onTouchEnd={() => handleHold(false)}
        >
          {currentStory.type === 'image' ? (
            <img
              src={currentStory.url}
              alt="Story"
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              src={currentStory.url}
              className="w-full h-full object-contain"
              autoPlay
              muted={isMuted}
              loop={false}
            />
          )}

          {/* Tap Areas (Visual indicators on hover) */}
          <div className="absolute inset-0 flex">
            <div className="w-1/3 h-full flex items-center justify-start p-4 group">
              <ChevronLeft className="h-8 w-8 text-white opacity-0 group-hover:opacity-50 transition-opacity" />
            </div>
            <div className="w-1/3 h-full" />
            <div className="w-1/3 h-full flex items-center justify-end p-4 group">
              <ChevronRight className="h-8 w-8 text-white opacity-0 group-hover:opacity-50 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Paused Indicator */}
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <p className="text-white text-sm font-medium">Paused</p>
            </div>
          </div>
        )}

        {/* Quick Reactions */}
        <div className="absolute bottom-32 right-4 z-20 flex flex-col gap-3">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl hover:scale-110 transition-transform active:scale-95"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Reply Input */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-2">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleReply()}
              placeholder={`Reply to ${userData.displayName}...`}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm"
            />
            <Button
              size="icon"
              onClick={handleReply}
              disabled={!replyText.trim()}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>

          {/* View Count */}
          {currentStory.views !== undefined && (
            <p className="text-white/60 text-xs mt-2 text-center">
              👁️ {currentStory.views} views
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
