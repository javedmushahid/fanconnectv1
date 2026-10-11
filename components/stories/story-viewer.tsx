'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  Volume2,
  VolumeX,
  Flag,
  Ban,
  Eye,
  Trash2,
  MoreVertical,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { storiesAPI, Story, StoryCreator, StoryViewerEntry } from '@/lib/api/endpoints/stories'
import { useAuthStore } from '@/store/auth.store'

interface StoryViewerProps {
  userId: string
}

const QUICK_REACTIONS = ['❤️', '😂', '😮', '😢', '👏', '🔥']

export default function StoryViewer({ userId }: StoryViewerProps) {
  const router = useRouter()
  const { user: currentUser } = useAuthStore()

  const [creator, setCreator] = useState<StoryCreator | null>(null)
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [replyText, setReplyText] = useState('')
  const [isMuted, setIsMuted] = useState(false)

  const [showViewers, setShowViewers] = useState(false)
  const [viewers, setViewers] = useState<StoryViewerEntry[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [isLoadingViewers, setIsLoadingViewers] = useState(false)

  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const pauseTimeout = useRef<NodeJS.Timeout | null>(null)
  const viewedRef = useRef<Set<string>>(new Set())

  // Load stories on mount
  useEffect(() => {
    storiesAPI
      .getUserStories(userId)
      .then(({ creator, stories }) => {
        setCreator(creator)
        setStories(stories)
      })
      .catch(() => {
        toast.error('Could not load stories')
        router.push('/stories')
      })
      .finally(() => setIsLoading(false))
  }, [userId])

  const currentStory = stories[currentIndex]
  const isOwnStory = currentUser?.id === userId

  // Mark story as viewed (once per story)
  useEffect(() => {
    if (!currentStory || isOwnStory) return
    if (viewedRef.current.has(currentStory.id)) return
    viewedRef.current.add(currentStory.id)
    storiesAPI.markViewed(currentStory.id).catch(() => {})
  }, [currentStory?.id, isOwnStory])

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || !currentStory) return

    const duration = currentStory.type === 'VIDEO' && currentStory.duration
      ? currentStory.duration * 1000
      : 5000
    const interval = 50
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
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [currentIndex, isPaused, currentStory])

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setProgress(0)
    } else {
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
    if (x < width / 3) handlePrevious()
    else if (x > (width * 2) / 3) handleNext()
  }

  const handleHold = (holding: boolean) => {
    if (holding) {
      setIsPaused(true)
      if (pauseTimeout.current) clearTimeout(pauseTimeout.current)
    } else {
      pauseTimeout.current = setTimeout(() => setIsPaused(false), 100)
    }
  }

  const handleReaction = (emoji: string) => {
    toast.success(`Reacted with ${emoji}`)
  }

  const handleReply = () => {
    if (!replyText.trim()) return
    toast.success('Reply sent!')
    setReplyText('')
  }

  const handleDeleteStory = async () => {
    if (!currentStory) return
    try {
      await storiesAPI.deleteStory(currentStory.id)
      toast.success('Story deleted')
      const remaining = stories.filter((s) => s.id !== currentStory.id)
      if (remaining.length === 0) {
        router.push('/stories')
      } else {
        setStories(remaining)
        setCurrentIndex(Math.min(currentIndex, remaining.length - 1))
        setProgress(0)
      }
    } catch {
      toast.error('Failed to delete story')
    }
  }

  const handleShowViewers = async () => {
    if (!currentStory) return
    setIsLoadingViewers(true)
    setShowViewers(true)
    try {
      const { viewers, totalViews } = await storiesAPI.getViewers(currentStory.id)
      setViewers(viewers)
      setTotalViews(totalViews)
    } catch {
      toast.error('Could not load viewers')
    } finally {
      setIsLoadingViewers(false)
    }
  }

  const getTimeAgo = (dateStr: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <Skeleton className="w-full max-w-lg h-full bg-gray-800" />
      </div>
    )
  }

  if (!creator || stories.length === 0) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center gap-4">
        <p className="text-white text-lg">No stories available</p>
        <Button variant="outline" onClick={() => router.push('/stories')}>
          Go back
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
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
              <AvatarImage src={creator.avatar ?? undefined} />
              <AvatarFallback>{creator.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-semibold text-sm drop-shadow">{creator.name}</p>
              <p className="text-white/80 text-xs drop-shadow">
                {getTimeAgo(currentStory.createdAt)}
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
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-black/90 backdrop-blur-sm text-white border-white/20"
              >
                {isOwnStory ? (
                  <>
                    <DropdownMenuItem
                      className="text-white focus:bg-white/20 focus:text-white"
                      onClick={handleShowViewers}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Viewers
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:bg-destructive/20 focus:text-destructive"
                      onClick={handleDeleteStory}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Story
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem className="text-white focus:bg-white/20 focus:text-white">
                      <Flag className="h-4 w-4 mr-2" />
                      Report Story
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/20 focus:text-destructive">
                      <Ban className="h-4 w-4 mr-2" />
                      Block User
                    </DropdownMenuItem>
                  </>
                )}
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
          {currentStory.type === 'IMAGE' ? (
            <img
              src={currentStory.mediaUrl}
              alt="Story"
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              src={currentStory.mediaUrl}
              className="w-full h-full object-contain"
              autoPlay
              muted={isMuted}
              loop={false}
            />
          )}

          {/* Tap Area Indicators */}
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

        {/* Quick Reactions (only for other users' stories) */}
        {!isOwnStory && (
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
        )}

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent">
          {isOwnStory ? (
            /* View count for own stories */
            <button
              onClick={handleShowViewers}
              className="flex items-center gap-2 text-white/80 text-sm hover:text-white transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>{currentStory.viewsCount} views</span>
            </button>
          ) : (
            /* Reply input for other users' stories */
            <div className="flex items-center gap-2">
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                placeholder={`Reply to ${creator.name}...`}
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
          )}
        </div>
      </div>

      {/* Viewers Dialog */}
      <Dialog open={showViewers} onOpenChange={setShowViewers}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Story Viewers ({totalViews})</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {isLoadingViewers ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))
            ) : viewers.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No viewers yet</p>
            ) : (
              viewers.map((entry) => (
                <div key={entry.user.id} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.user.avatar ?? undefined} />
                    <AvatarFallback>{entry.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{entry.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{entry.user.username} · {getTimeAgo(entry.viewedAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
