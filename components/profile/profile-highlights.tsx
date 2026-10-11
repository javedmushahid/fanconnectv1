'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Upload, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { storiesAPI, Highlight } from '@/lib/api/endpoints/stories'

interface ProfileHighlightsProps {
  userId: string
  isOwnProfile?: boolean
}

export default function ProfileHighlights({
  userId,
  isOwnProfile = false,
}: ProfileHighlightsProps) {
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCoverUrl, setNewCoverUrl] = useState('')
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<Highlight | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!userId) return
    storiesAPI
      .getHighlights(userId)
      .then(({ highlights }) => setHighlights(highlights))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [userId])

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setCoverPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      toast.error('Please enter a title')
      return
    }
    setIsCreating(true)
    try {
      const { highlight } = await storiesAPI.createHighlight(
        newTitle.trim(),
        [],
        newCoverUrl || undefined
      )
      setHighlights((prev) => [highlight, ...prev])
      setNewTitle('')
      setNewCoverUrl('')
      setCoverPreview(null)
      setShowCreateDialog(false)
      toast.success('Highlight created!')
    } catch {
      toast.error('Failed to create highlight')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await storiesAPI.deleteHighlight(deleteTarget.id)
      setHighlights((prev) => prev.filter((h) => h.id !== deleteTarget.id))
      toast.success('Highlight deleted')
    } catch {
      toast.error('Failed to delete highlight')
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-none flex flex-col items-center gap-2">
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="h-3 w-14 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (!isOwnProfile && highlights.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
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
          <div key={highlight.id} className="flex-none flex flex-col items-center gap-2 group relative">
            <div className="w-20 h-20 rounded-full border-2 border-muted-foreground/30 overflow-hidden group-hover:border-primary transition-colors">
              {highlight.coverUrl ? (
                <img
                  src={highlight.coverUrl}
                  alt={highlight.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {highlight.title[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-center line-clamp-1 w-20">
              {highlight.title}
            </span>

            {/* Delete button — only on own profile */}
            {isOwnProfile && (
              <button
                onClick={() => setDeleteTarget(highlight)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full items-center justify-center hidden group-hover:flex"
              >
                <Trash2 className="h-3 w-3 text-white" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Create Highlight Dialog */}
      <Dialog
        open={showCreateDialog}
        onOpenChange={(open) => {
          if (!open) {
            setNewTitle('')
            setNewCoverUrl('')
            setCoverPreview(null)
          }
          setShowCreateDialog(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Highlight</DialogTitle>
            <DialogDescription>
              Save your stories to a highlight on your profile
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Cover Image */}
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/30 overflow-hidden flex items-center justify-center">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
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
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 200×200px</p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="highlight-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="highlight-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Workouts, Travel, Food"
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground">{newTitle.length}/20 characters</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Highlight'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Highlight?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" will be permanently removed from your profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
