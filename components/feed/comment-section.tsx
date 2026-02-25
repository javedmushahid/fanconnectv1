'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Heart, MoreVertical, Reply, Send, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { postsAPI, ApiComment } from '@/lib/api/endpoints/posts'
import { useAuth } from '@/hooks/use-auth'

const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}

interface CommentSectionProps {
  postId: string
  onCommentAdded?: () => void
  onCommentDeleted?: () => void
}

export default function CommentSection({ postId, onCommentAdded, onCommentDeleted }: CommentSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<ApiComment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replySubmitting, setReplySubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetchComments = async () => {
      try {
        const { comments: fetched } = await postsAPI.getComments(postId)
        if (!cancelled) setComments(fetched)
      } catch {
        // silently fail — empty state shown
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchComments()
    return () => { cancelled = true }
  }, [postId])

  const handleAddComment = async () => {
    if (!newComment.trim() || submitting) return
    setSubmitting(true)
    try {
      const created = await postsAPI.addComment(postId, newComment.trim())
      const withUser = {
        ...created,
        user: created.user ?? {
          id: user?.id ?? '',
          username: user?.username ?? '',
          name: user?.name ?? '',
          avatar: user?.avatar ?? null,
        },
      }
      setComments((prev) => [withUser, ...prev])
      setNewComment('')
      onCommentAdded?.()
    } catch {
      // keep input so user can retry
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddReply = async (commentId: string) => {
    if (!replyText.trim() || replySubmitting) return
    setReplySubmitting(true)
    try {
      const created = await postsAPI.addComment(postId, replyText.trim(), commentId)
      const withUser = {
        ...created,
        user: created.user ?? {
          id: user?.id ?? '',
          username: user?.username ?? '',
          name: user?.name ?? '',
          avatar: user?.avatar ?? null,
        },
      }
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, replies: [...(c.replies ?? []), withUser] }
            : c
        )
      )
      setReplyText('')
      setReplyingTo(null)
      onCommentAdded?.()
    } catch {
      // keep input so user can retry
    } finally {
      setReplySubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string, parentId?: string | null) => {
    try {
      await postsAPI.deleteComment(commentId)
      if (parentId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: (c.replies ?? []).filter((r) => r.id !== commentId) }
              : c
          )
        )
      } else {
        setComments((prev) => prev.filter((c) => c.id !== commentId))
      }
      onCommentDeleted?.()
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span className="text-sm">Loading comments...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Add Comment */}
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={user?.avatar ?? ''} />
          <AvatarFallback>{user?.name?.[0] ?? 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAddComment()
            }}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || submitting}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet. Be the first!
          </p>
        )}

        {comments.map((comment,index) => (
          <div key={index} className="space-y-3">
            {/* Main Comment */}
            <div className="flex gap-3 group">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={comment.user.avatar ?? ''} />
                <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm hover:underline cursor-pointer">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">@{comment.user.username}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>

                  {(user?.id === comment.authorId) && (
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
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <p className="text-sm leading-relaxed">{comment.content}</p>

                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 gap-1 hover:bg-blue-50 dark:hover:bg-blue-950"
                    onClick={() =>
                      setReplyingTo(replyingTo === comment.id ? null : comment.id)
                    }
                  >
                    <Reply className="h-4 w-4" />
                    <span className="text-xs">Reply</span>
                  </Button>
                </div>

                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <div className="flex gap-2 mt-3 animate-in slide-in-from-top">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={user?.avatar ?? ''} />
                      <AvatarFallback>{user?.name?.[0] ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder={`Reply to @${comment.user.username}...`}
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
                          disabled={!replyText.trim() || replySubmitting}
                          className="bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                          {replySubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : null}
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
                          <AvatarImage src={reply.user.avatar ?? ''} />
                          <AvatarFallback>{reply.user.name[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm hover:underline cursor-pointer">
                                {reply.user.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                @{reply.user.username}
                              </span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground">
                                {formatRelativeTime(reply.createdAt)}
                              </span>
                            </div>

                            {user?.id === reply.authorId && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="cursor-pointer text-destructive"
                                    onClick={() => handleDeleteComment(reply.id, comment.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed">{reply.content}</p>
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
    </div>
  )
}
