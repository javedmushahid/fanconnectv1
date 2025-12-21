'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Highlight {
  id: string
  title: string
  coverImage: string
  storyCount: number
  stories: {
    id: string
    url: string
    timestamp: number
  }[]
}

interface ProfileHighlightsProps {
  isOwnProfile?: boolean
}

const MOCK_HIGHLIGHTS: Highlight[] = [
  {
    id: 'highlight1',
    title: 'Workouts',
    coverImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop',
    storyCount: 5,
    stories: [
      {
        id: 'story1',
        url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1080&h=1920&fit=crop',
        timestamp: Date.now() - 86400000,
      },
      {
        id: 'story2',
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1080&h=1920&fit=crop',
        timestamp: Date.now() - 172800000,
      },
    ],
  },
  {
    id: 'highlight2',
    title: 'Nutrition',
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
    storyCount: 3,
    stories: [
      {
        id: 'story3',
        url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1080&h=1920&fit=crop',
        timestamp: Date.now() - 259200000,
      },
    ],
  },
  {
    id: 'highlight3',
    title: 'Tips',
    coverImage: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=200&h=200&fit=crop',
    storyCount: 7,
    stories: [],
  },
]

export default function ProfileHighlights({ isOwnProfile = false }: ProfileHighlightsProps) {
  const router = useRouter()
  const [highlights, setHighlights] = useState<Highlight[]>(MOCK_HIGHLIGHTS)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [newHighlight, setNewHighlight] = useState({
    title: '',
    coverImage: '',
  })

  const handleCreateHighlight = () => {
    if (!newHighlight.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    const highlight: Highlight = {
      id: Date.now().toString(),
      title: newHighlight.title,
      coverImage: newHighlight.coverImage || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop',
      storyCount: 0,
      stories: [],
    }

    setHighlights([...highlights, highlight])
    setNewHighlight({ title: '', coverImage: '' })
    setShowCreateDialog(false)
    toast.success('Highlight created!')
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setNewHighlight({ ...newHighlight, coverImage: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const viewHighlight = (highlight: Highlight) => {
    if (highlight.stories.length === 0) {
      toast.error('No stories in this highlight')
      return
    }
    setSelectedHighlight(highlight)
    setCurrentStoryIndex(0)
    setShowViewDialog(true)
  }

  const nextStory = () => {
    if (selectedHighlight && currentStoryIndex < selectedHighlight.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
    } else {
      setShowViewDialog(false)
    }
  }

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
    }
  }

  const getTimeAgo = (timestamp: number) => {
    const days = Math.floor((Date.now() - timestamp) / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    return `${Math.floor(days / 30)}mo ago`
  }

  return (
    <div className="space-y-3">
      {/* Highlights Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* New Highlight Button (Own Profile Only) */}
        {isOwnProfile && (
          <button
            onClick={() => setShowCreateDialog(true)}
            className="flex-none flex flex-col items-center gap-2 group"
          >
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center group-hover:border-primary transition-colors">
              <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
              New
            </span>
          </button>
        )}

        {/* Highlight Circles */}
        {highlights.map((highlight) => (
          <button
            key={highlight.id}
            onClick={() => viewHighlight(highlight)}
            className="flex-none flex flex-col items-center gap-2 group"
          >
            <div className="w-20 h-20 rounded-full border-2 border-muted-foreground/30 overflow-hidden group-hover:border-primary transition-colors">
              <img
                src={highlight.coverImage}
                alt={highlight.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>
            <span className="text-xs font-medium text-center line-clamp-1 w-20">
              {highlight.title}
            </span>
          </button>
        ))}
      </div>

      {/* Create Highlight Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Highlight</DialogTitle>
            <DialogDescription>
              Save your stories to a highlight on your profile
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Cover Image Upload */}
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/30 overflow-hidden flex items-center justify-center">
                  {newHighlight.coverImage ? (
                    <img
                      src={newHighlight.coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <Label htmlFor="cover-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Cover
                      </span>
                    </Button>
                  </Label>
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 200x200px
                  </p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Highlight Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={newHighlight.title}
                onChange={(e) =>
                  setNewHighlight({ ...newHighlight, title: e.target.value })
                }
                placeholder="e.g., Workouts, Travel, Food"
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground">
                {newHighlight.title.length}/20 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateHighlight}>Create Highlight</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Highlight Dialog (Story Viewer) */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-sm p-0 bg-black">
          {selectedHighlight && selectedHighlight.stories[currentStoryIndex] && (
            <div className="relative aspect-[9/16]">
              {/* Progress Bars */}
              <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3">
                {selectedHighlight.stories.map((_, index) => (
                  <div
                    key={index}
                    className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{
                        width: index < currentStoryIndex ? '100%' : index === currentStoryIndex ? '100%' : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="absolute top-12 left-0 right-0 z-20 px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <img
                      src={selectedHighlight.coverImage}
                      alt={selectedHighlight.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm drop-shadow">
                      {selectedHighlight.title}
                    </p>
                    <p className="text-white/80 text-xs drop-shadow">
                      {getTimeAgo(selectedHighlight.stories[currentStoryIndex].timestamp)}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowViewDialog(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Story Image */}
              <img
                src={selectedHighlight.stories[currentStoryIndex].url}
                alt="Story"
                className="w-full h-full object-contain"
              />

              {/* Navigation */}
              <div className="absolute inset-0 flex">
                <div
                  className="w-1/2 h-full cursor-pointer"
                  onClick={previousStory}
                />
                <div
                  className="w-1/2 h-full cursor-pointer"
                  onClick={nextStory}
                />
              </div>

              {/* Story Count */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white/60 text-xs">
                  {currentStoryIndex + 1} / {selectedHighlight.stories.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
