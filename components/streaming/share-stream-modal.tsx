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
import { Label } from '@/components/ui/label'
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link2,
  MessageCircle,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'

interface ShareStreamModalProps {
  open: boolean
  onClose: () => void
  streamTitle: string
  streamId: string
}

export default function ShareStreamModal({
  open,
  onClose,
  streamTitle,
  streamId,
}: ShareStreamModalProps) {
  const [copied, setCopied] = useState(false)

  const streamUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/streaming/${streamId}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(streamUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleShare = (platform: string) => {
    const text = `Check out this live stream: ${streamTitle}`
    const encodedUrl = encodeURIComponent(streamUrl)
    const encodedText = encodeURIComponent(text)

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      email: `mailto:?subject=${encodedText}&body=${encodedUrl}`,
    }

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400')
      toast.success(`Opening ${platform}...`)
    }
  }

  const shareOptions = [
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-blue-500/10 hover:text-blue-500',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-600/10 hover:text-blue-600',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-green-500/10 hover:text-green-500',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-blue-700/10 hover:text-blue-700',
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'hover:bg-gray-500/10 hover:text-gray-500',
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Stream</DialogTitle>
          <DialogDescription>
            Share this live stream with your friends
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Stream Info */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2 animate-pulse" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1">{streamTitle}</p>
                <p className="text-xs text-muted-foreground">Currently streaming live</p>
              </div>
            </div>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <Label>Stream Link</Label>
            <div className="flex gap-2">
              <Input value={streamUrl} readOnly className="flex-1" />
              <Button
                onClick={handleCopyLink}
                variant={copied ? 'default' : 'outline'}
                className="flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-2">
            <Label>Share via</Label>
            <div className="grid grid-cols-3 gap-3">
              {shareOptions.map((option) => {
                const Icon = option.icon
                return (
                  <Button
                    key={option.id}
                    variant="outline"
                    onClick={() => handleShare(option.id)}
                    className={`h-20 flex flex-col items-center justify-center gap-2 transition-colors ${option.color}`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs">{option.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Embed Code (Optional) */}
          <details className="space-y-2">
            <summary className="text-sm font-medium cursor-pointer hover:text-primary">
              Embed Code
            </summary>
            <div className="space-y-2 pt-2">
              <Input
                value={`<iframe src="${streamUrl}" width="800" height="450" frameborder="0" allowfullscreen></iframe>`}
                readOnly
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Copy this code to embed the stream on your website
              </p>
            </div>
          </details>
        </div>
      </DialogContent>
    </Dialog>
  )
}
