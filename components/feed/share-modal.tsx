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
import { Copy, Check, MessageCircle, Mail, Link as LinkIcon } from 'lucide-react'

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.673 3.667h-3.246v7.98C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)
import { cn } from '@/lib/utils'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
  creatorUsername: string
  postContent?: string
}

export default function ShareModal({ isOpen, onClose, postId, creatorUsername, postContent }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const shareUrl = `${origin}/${creatorUsername}?post=${postId}`
  const shareText = postContent
    ? postContent.length > 100
      ? postContent.slice(0, 100) + '…'
      : postContent
    : 'Check out this amazing post on FanConnect!'

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const socialShares = [
    {
      name: 'X',
      icon: XIcon,
      color: 'hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white',
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          '_blank'
        )
      },
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      color: 'hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600',
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank'
        )
      },
    },
    {
      name: 'LinkedIn',
      icon: LinkedInIcon,
      color: 'hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700',
      onClick: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        )
      },
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
      },
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-700',
      onClick: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent('Check this out!')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
      },
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
                    'flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 hover:scale-105',
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
              <span className="bg-background px-2 text-muted-foreground">Or copy link</span>
            </div>
          </div>

          {/* Copy Link */}
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="flex-1 bg-muted text-xs" />
            <Button
              onClick={handleCopyLink}
              className={cn(
                'transition-all duration-300',
                copied && 'bg-green-600 hover:bg-green-700'
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
              <p className="text-sm text-muted-foreground line-clamp-2">{postContent}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
