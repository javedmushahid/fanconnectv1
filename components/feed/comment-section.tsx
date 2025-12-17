'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Heart, MoreVertical, Reply, Send } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface Comment {
  id: string
  userId: string
  username: string
  displayName: string
  avatar: string
  content: string
  likes: number
  isLiked: boolean
  createdAt: string
  replies?: Comment[]
}

interface CommentSectionProps {
  postId: string
  initialComments?: Comment[]
}

export default function CommentSection({ postId, initialComments = [] }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'janedoe',
      displayName: 'Jane Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
      content: newComment,
      likes: 0,
      isLiked: false,
      createdAt: 'Just now',
      replies: [],
    }

    setComments([comment, ...comments])
    setNewComment('')
  }

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ))
  }

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return

    const reply: Comment = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'janedoe',
      displayName: 'Jane Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
      content: replyText,
      likes: 0,
      isLiked: false,
      createdAt: 'Just now',
    }

    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, replies: [...(comment.replies || []), reply] }
        : comment
    ))

    setReplyText('')
    setReplyingTo(null)
  }

  return (
    <div className="space-y-4">
      {/* Add Comment */}
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            {/* Main Comment */}
            <div className="flex gap-3 group">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={comment.avatar} />
                <AvatarFallback>{comment.displayName[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                {/* Comment Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm hover:underline cursor-pointer">
                        {comment.displayName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        @{comment.username}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        {comment.createdAt}
                      </span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">Report</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Comment Content */}
                <p className="text-sm leading-relaxed">{comment.content}</p>

                {/* Comment Actions */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 px-2 gap-1 hover:bg-red-50 dark:hover:bg-red-950",
                      comment.isLiked && "text-red-500"
                    )}
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    <Heart className={cn("h-4 w-4", comment.isLiked && "fill-red-500")} />
                    {comment.likes > 0 && (
                      <span className="text-xs">{comment.likes}</span>
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 gap-1 hover:bg-blue-50 dark:hover:bg-blue-950"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    <Reply className="h-4 w-4" />
                    <span className="text-xs">Reply</span>
                  </Button>
                </div>

                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <div className="flex gap-2 mt-3 animate-in slide-in-from-top">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder={`Reply to @${comment.username}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="min-h-[60px] resize-none text-sm"
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyText('')
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!replyText.trim()}
                          className="bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 space-y-3 pl-4 border-l-2 border-muted">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3 group">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={reply.avatar} />
                          <AvatarFallback>{reply.displayName[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm hover:underline cursor-pointer">
                              {reply.displayName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              @{reply.username}
                            </span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">
                              {reply.createdAt}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">{reply.content}</p>
                          
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 gap-1 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <Heart className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {comments.length > 0 && (
        <Button variant="ghost" className="w-full" size="sm">
          Load more comments
        </Button>
      )}
    </div>
  )
}
