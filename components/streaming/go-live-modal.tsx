'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Video, Loader2, Camera } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface GoLiveModalProps {
  open: boolean
  onClose: () => void
}

const CATEGORIES = [
  'Fitness & Health',
  'Cooking & Food',
  'Art & Design',
  'Music',
  'Gaming',
  'Education',
  'Technology',
  'Lifestyle',
  'Fashion & Beauty',
  'Travel',
  'Photography',
  'Writing & Literature',
]

export default function GoLiveModal({ open, onClose }: GoLiveModalProps) {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)
  const [streamData, setStreamData] = useState({
    title: '',
    description: '',
    category: '',
  })

  const handleGoLive = async () => {
    if (!streamData.title.trim()) {
      toast.error('Please enter a stream title')
      return
    }

    if (!streamData.category) {
      toast.error('Please select a category')
      return
    }

    setIsStarting(true)

    // Simulate stream creation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const streamId = 'stream-' + Date.now()
    
    toast.success('Stream started! 🔴')
    onClose()
    
    // Redirect to stream page
    router.push(`/streaming/${streamId}`)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
              <Video className="h-5 w-5 text-white" />
            </div>
            Go Live
          </DialogTitle>
          <DialogDescription>
            Set up your live stream and start broadcasting to your audience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Stream Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={streamData.title}
              onChange={(e) =>
                setStreamData({ ...streamData, title: e.target.value })
              }
              placeholder="e.g., Morning Workout Routine 🔥"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              {streamData.title.length}/100 characters
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={streamData.category}
              onValueChange={(value) =>
                setStreamData({ ...streamData, category: value })
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={streamData.description}
              onChange={(e) =>
                setStreamData({ ...streamData, description: e.target.value })
              }
              placeholder="Tell your audience what this stream is about..."
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {streamData.description.length}/500 characters
            </p>
          </div>

          {/* Preview Settings */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Stream Settings
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Quality</p>
                <p className="font-medium">1080p HD</p>
              </div>
              <div>
                <p className="text-muted-foreground">Latency</p>
                <p className="font-medium">Low (~2s)</p>
              </div>
              <div>
                <p className="text-muted-foreground">Audio</p>
                <p className="font-medium">Enabled</p>
              </div>
              <div>
                <p className="text-muted-foreground">Chat</p>
                <p className="font-medium">Enabled</p>
              </div>
            </div>
          </div>

          {/* Info Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-sm">
            <p className="text-blue-900 dark:text-blue-100">
              <strong>Tip:</strong> Make sure you have a stable internet connection
              before going live. Recommended upload speed: 5+ Mbps
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isStarting}>
            Cancel
          </Button>
          <Button
            onClick={handleGoLive}
            disabled={isStarting}
            className="gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
          >
            {isStarting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Starting Stream...
              </>
            ) : (
              <>
                <Video className="h-4 w-4" />
                Go Live Now
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
