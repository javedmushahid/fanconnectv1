'use client'

import { Heart, MessageCircle, Bookmark, Share2, Lock, MoreVertical, Send } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Post } from '@/types'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: Post
  isSubscribed?: boolean
}

export default function PostCardEnhanced({ post, isSubscribed = false }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [showLikeAnimation, setShowLikeAnimation] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    setLikesCount(liked ? likesCount - 1 : likesCount + 1)
    if (!liked) {
      setShowLikeAnimation(true)
      setTimeout(() => setShowLikeAnimation(false), 1000)
    }
  }

  const handleDoubleClick = () => {
    if (!liked) {
      handleLike()
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-background to-muted/20">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2">
              <AvatarImage src={post.creator.avatar} alt={post.creator.displayName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {post.creator.displayName[0]}
              </AvatarFallback>
            </Avatar>
            {post.creator.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm sm:text-base truncate hover:text-primary transition-colors cursor-pointer">
                {post.creator.displayName}
              </h4>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              @{post.creator.username} · {post.createdAt}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer">Report</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Hide</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Copy link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-sm sm:text-base text-foreground whitespace-pre-wrap break-words leading-relaxed">
            {post.content}
          </p>
        </div>
      )}

      {/* Media */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="relative bg-muted group" onDoubleClick={handleDoubleClick}>
          {post.isLocked && !isSubscribed ? (
            <div className="relative aspect-video sm:aspect-[16/10] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
              </div>
              
              <div className="absolute inset-0 backdrop-blur-xl bg-black/60 flex flex-col items-center justify-center p-4 text-center z-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                  <Lock className="w-16 h-16 text-white relative z-10 drop-shadow-2xl" />
                </div>
                <p className="text-white font-bold text-lg mb-2 drop-shadow-lg">
                  🔒 Exclusive Content
                </p>
                <p className="text-gray-200 text-sm mb-4">
                  Subscribe to unlock premium content
                </p>
                {post.price && (
                  <p className="text-gray-300 text-xs mb-4">
                    Or purchase for ${post.price}
                  </p>
                )}
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl">
                  Subscribe Now
                </Button>
              </div>
            </div>
          ) : (
            <>
              {post.mediaType === 'image' && (
                <div className="relative aspect-video sm:aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.mediaUrls[0]}
                    alt="Post media"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Like Animation Overlay */}
                  {showLikeAnimation && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Heart className="w-24 h-24 text-red-500 fill-red-500 animate-ping" />
                    </div>
                  )}
                </div>
              )}
              {post.mediaType === 'video' && (
                <video
                  src={post.mediaUrls[0]}
                  controls
                  className="w-full aspect-video"
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t bg-gradient-to-r from-background to-muted/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "gap-2 px-2 sm:px-3 transition-all duration-300 hover:scale-110",
                liked && "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              )}
            >
              <Heart 
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  liked && "fill-red-500 animate-pulse"
                )} 
              />
              <span className="text-xs sm:text-sm font-semibold">{likesCount}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 px-2 sm:px-3 hover:scale-110 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs sm:text-sm">{post.commentsCount}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-2 sm:px-3 hover:scale-110 transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-600"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSaved(!saved)}
            className={cn(
              "transition-all duration-300 hover:scale-110",
              saved && "text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
            )}
          >
            <Bookmark className={cn("h-5 w-5 transition-all", saved && "fill-blue-500")} />
          </Button>
        </div>
      </div>
    </Card>
  )
}
