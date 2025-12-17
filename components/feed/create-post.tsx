'use client'

import { useState } from 'react'
import { Image as ImageIcon, Video, Smile, Lock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function CreatePost() {
  const [content, setContent] = useState('')
  const [isLocked, setIsLocked] = useState(false)

  return (
    <Card className="p-3 sm:p-4">
      <div className="flex gap-3 sm:gap-4">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" alt="You" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px] sm:min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-sm sm:text-base"
          />
          
          {/* Media Upload Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4 pb-3 sm:pb-4 border-b">
            <Button variant="ghost" size="sm" className="gap-2 h-8 sm:h-9 px-2 sm:px-3">
              <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline text-sm">Photo</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 h-8 sm:h-9 px-2 sm:px-3">
              <Video className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline text-sm">Video</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 h-8 sm:h-9 px-2 sm:px-3">
              <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline text-sm">Emoji</span>
            </Button>
          </div>

          {/* Post Options */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-3 sm:mt-4">
            <div className="flex items-center gap-2">
              <Switch
                id="subscribers-only"
                checked={isLocked}
                onCheckedChange={setIsLocked}
              />
              <Label htmlFor="subscribers-only" className="text-xs sm:text-sm cursor-pointer flex items-center gap-1">
                <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                Subscribers only
              </Label>
            </div>
            <Button disabled={!content.trim()} size="sm" className="w-full sm:w-auto">
              Post
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
