'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Share2, 
  Users, 
  DollarSign,
  MoreVertical,
  Heart,
  Flag
} from 'lucide-react'
import StreamChat from './stream-chat'
import ViewersModal from './viewers-modal'
import SuperChatModal from './super-chat-modal'
import ShareStreamModal from './share-stream-modal'
import VideoPlayer from './video-player'
import CreatorStreamControls from './creator-stream-controls'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface StreamViewerProps {
  streamId: string
}

const MOCK_STREAM = {
  id: '1',
  title: 'Morning Workout Routine - Full Body Training 🔥',
  creator: {
    id: 'creator1',
    username: 'fitnessguru',
    displayName: 'Fitness Guru',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessGuru',
    isVerified: true,
  },
  viewers: 1247,
  likes: 856,
  category: 'Fitness',
  startedAt: new Date(Date.now() - 45 * 60 * 1000),
  isLive: true,
}

export default function StreamViewer({ streamId }: StreamViewerProps) {
  const [viewers, setViewers] = useState(MOCK_STREAM.viewers)
  const [likes, setLikes] = useState(MOCK_STREAM.likes)
  const [isLiked, setIsLiked] = useState(false)
  const [showViewers, setShowViewers] = useState(false)
  const [showSuperChat, setShowSuperChat] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [duration, setDuration] = useState(0)

  // Mock: Check if current user is the creator
  const isCreator = true // Set to false to hide creator controls

  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setViewers((prev) => prev + Math.floor(Math.random() * 5) - 2)
    }, 5000)

    const durationInterval = setInterval(() => {
      setDuration(Math.floor((Date.now() - MOCK_STREAM.startedAt.getTime()) / 1000))
    }, 1000)

    return () => {
      clearInterval(viewerInterval)
      clearInterval(durationInterval)
    }
  }, [])

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setIsLiked(!isLiked)
  }

  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = duration % 60
  const streamDuration = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-0 lg:px-4 py-0 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-4">
          {/* Main Content - Video and Info */}
          <div className="flex-1 flex flex-col">
            {/* Video Player */}
            <div className="relative bg-black w-full">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0">
                  <VideoPlayer streamId={streamId} />
                </div>

                {/* Live Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge className="bg-red-600 text-white px-3 py-1.5 text-sm font-semibold animate-pulse shadow-lg">
                    🔴 LIVE
                  </Badge>
                </div>

                {/* Top Right Info */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                  <Badge className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 shadow-lg">
                    <Users className="h-4 w-4 mr-1.5 inline" />
                    {viewers.toLocaleString()}
                  </Badge>
                  <Badge className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 font-mono shadow-lg">
                    {streamDuration}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Stream Info Section */}
            <div className="p-4 lg:p-6 space-y-4 bg-background">
              {/* Title and Category */}
              <div className="space-y-2">
                <h1 className="text-xl lg:text-2xl font-bold leading-tight">
                  {MOCK_STREAM.title}
                </h1>
                <Badge variant="secondary" className="text-xs">
                  {MOCK_STREAM.category}
                </Badge>
              </div>

              {/* Creator Info */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-12 w-12 ring-2 ring-primary flex-shrink-0">
                    <AvatarImage src={MOCK_STREAM.creator.avatar} />
                    <AvatarFallback>FG</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">
                        {MOCK_STREAM.creator.displayName}
                      </h3>
                      {MOCK_STREAM.creator.isVerified && (
                        <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0 flex-shrink-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      @{MOCK_STREAM.creator.username}
                    </p>
                  </div>
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant={isLiked ? 'default' : 'outline'}
                    size="sm"
                    onClick={handleLike}
                    className="gap-2"
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likes.toLocaleString()}</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowViewers(true)}
                    className="gap-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Viewers</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => setShowSuperChat(true)}
                    className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Tip</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowShare(true)}
                    className="gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Flag className="h-4 w-4 mr-2" />
                        Report Stream
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-2">
                <Button
                  variant={isLiked ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleLike}
                  className="gap-2 flex-shrink-0"
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likes.toLocaleString()}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowViewers(true)}
                  className="gap-2 flex-shrink-0"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Viewers</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => setShowSuperChat(true)}
                  className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex-shrink-0"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Tip</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShare(true)}
                  className="gap-2 flex-shrink-0"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Flag className="h-4 w-4 mr-2" />
                      Report Stream
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Creator Controls - Only visible to stream owner */}
              {isCreator && (
                <div className="pt-4 border-t">
                  <CreatorStreamControls streamId={streamId} />
                </div>
              )}
            </div>

            {/* Mobile Chat */}
            <div className="lg:hidden border-t">
              <StreamChat streamId={streamId} compact />
            </div>
          </div>

          {/* Desktop Chat Sidebar */}
          <div className="hidden lg:block lg:w-96 xl:w-[400px] flex-shrink-0">
            <div className="sticky top-6">
              <StreamChat streamId={streamId} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ViewersModal
        open={showViewers}
        onClose={() => setShowViewers(false)}
        viewers={viewers}
      />
      <SuperChatModal
        open={showSuperChat}
        onClose={() => setShowSuperChat(false)}
        creatorName={MOCK_STREAM.creator.displayName}
      />
      <ShareStreamModal
        open={showShare}
        onClose={() => setShowShare(false)}
        streamTitle={MOCK_STREAM.title}
        streamId={streamId}
      />
    </div>
  )
}
