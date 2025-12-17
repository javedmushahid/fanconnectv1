'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { 
  Copy, 
  Check,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Mail,
  Link as LinkIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
  postContent?: string
}

export default function ShareModal({ isOpen, onClose, postId, postContent }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `https://fanconnect.com/post/${postId}`
  const shareText = postContent || 'Check out this amazing post on FanConnect!'

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const socialShares = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-sky-50 dark:hover:bg-sky-950 hover:text-sky-500',
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          '_blank'
        )
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600',
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank'
        )
      }
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700',
      onClick: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        )
      }
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-600',
      onClick: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
          '_blank'
        )
      }
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-700',
      onClick: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent('Check this out!')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
      }
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <LinkIcon className="h-5 w-5 text-white" />
            </div>
            Share this post
          </DialogTitle>
          <DialogDescription>
            Share this content with your friends and followers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Social Media Buttons */}
          <div className="grid grid-cols-5 gap-3">
            {socialShares.map((social) => {
              const Icon = social.icon
              return (
                <button
                  key={social.name}
                  onClick={social.onClick}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 hover:scale-105",
                    social.color
                  )}
                >
                  <div className="p-2 rounded-full bg-muted">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">{social.name}</span>
                </button>
              )
            })}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or copy link
              </span>
            </div>
          </div>

          {/* Copy Link */}
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1 bg-muted"
            />
            <Button
              onClick={handleCopyLink}
              className={cn(
                "transition-all duration-300",
                copied && "bg-green-600 hover:bg-green-700"
              )}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>

          {/* Post Preview */}
          {postContent && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {postContent}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
