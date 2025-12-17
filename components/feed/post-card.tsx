'use client'

import { Heart, MessageCircle, Bookmark, Share2, Lock, MoreVertical } from 'lucide-react'
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

export default function PostCard({ post, isSubscribed = false }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likesCount)

  const handleLike = () => {
    setLiked(!liked)
    setLikesCount(liked ? likesCount - 1 : likesCount + 1)
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <AvatarImage src={post.creator.avatar} alt={post.creator.displayName} />
            <AvatarFallback>{post.creator.displayName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h4 className="font-semibold text-sm sm:text-base truncate">
                {post.creator.displayName}
              </h4>
              {post.creator.isVerified && (
                <Badge variant="secondary" className="h-4 w-4 p-0 flex items-center justify-center">
                  ✓
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              @{post.creator.username} · {post.createdAt}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report</DropdownMenuItem>
            <DropdownMenuItem>Hide</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-3 sm:px-4 pb-3">
          <p className="text-sm sm:text-base text-foreground whitespace-pre-wrap break-words">
            {post.content}
          </p>
        </div>
      )}

      {/* Media */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="relative bg-muted">
          {post.isLocked && !isSubscribed ? (
            <div className="relative aspect-video sm:aspect-[16/10] bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
              <div className="absolute inset-0 backdrop-blur-sm bg-black/60 flex flex-col items-center justify-center p-4 text-center">
                <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-white mb-3 sm:mb-4" />
                <p className="text-white font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  Subscribe to unlock
                </p>
                {post.price && (
                  <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                    Or purchase for ${post.price}
                  </p>
                )}
                <Button size="sm" className="sm:text-base">
                  Subscribe Now
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* {post.mediaType === 'image' && (
                <div className="relative aspect-video sm:aspect-[16/10]">
                  <Image
                    src={post.mediaUrls[0]}
                    alt="Post media"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {post.mediaType === 'video' && (
                <video
                  src={post.mediaUrls[0]}
                  controls
                  className="w-full aspect-video"
                />
              )} */}
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-3 sm:px-4 py-3 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "gap-2 px-2 sm:px-3",
                liked && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart className={cn("h-5 w-5", liked && "fill-red-500")} />
              <span className="text-xs sm:text-sm">{likesCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 px-2 sm:px-3">
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs sm:text-sm">{post.commentsCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="px-2 sm:px-3">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSaved(!saved)}
            className={cn(saved && "text-blue-500 hover:text-blue-600")}
          >
            <Bookmark className={cn("h-5 w-5", saved && "fill-blue-500")} />
          </Button>
        </div>
      </div>
    </Card>
  )
}
