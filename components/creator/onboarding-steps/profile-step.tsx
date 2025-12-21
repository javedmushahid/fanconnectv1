'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, ArrowRight, Upload, Image as ImageIcon } from 'lucide-react'

interface ProfileStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

const CATEGORIES = [
  'Fitness & Health',
  'Cooking & Food',
  'Art & Design',
  'Gaming',
  'Music',
  'Education',
  'Lifestyle',
  'Technology',
  'Business',
  'Entertainment',
]

export default function ProfileStep({ data, onUpdate, onNext, onPrevious }: ProfileStepProps) {
  const [displayName, setDisplayName] = useState(data.displayName || '')
  const [bio, setBio] = useState(data.bio || '')
  const [category, setCategory] = useState(data.category || '')
  const [avatar, setAvatar] = useState(data.avatar || '')
  const [banner, setBanner] = useState(data.banner || '')

  const bioLength = bio.length
  const bioMaxLength = 160

  const handleSubmit = () => {
    onUpdate({ displayName, bio, category, avatar, banner })
    onNext()
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBanner(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Up Your Profile</CardTitle>
        <p className="text-sm text-muted-foreground">
          Create a profile that represents you and attracts subscribers
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Banner Upload */}
        <div className="space-y-2">
          <Label>Banner Image</Label>
          <div className="relative h-48 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors overflow-hidden group cursor-pointer">
            {banner ? (
              <img src={banner} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-2" />
                <p className="text-sm">Click to upload banner (1200x300)</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Avatar Upload */}
        <div className="space-y-2">
          <Label>Profile Picture</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar} />
              <AvatarFallback>{displayName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <label htmlFor="avatar">
                <Button variant="outline" className="gap-2" asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                Recommended: 400x400px, max 2MB
              </p>
            </div>
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name *</Label>
          <Input
            id="displayName"
            placeholder="Your Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="bio">Bio *</Label>
            <span className={`text-xs ${bioLength > bioMaxLength ? 'text-destructive' : 'text-muted-foreground'}`}>
              {bioLength}/{bioMaxLength}
            </span>
          </div>
          <Textarea
            id="bio"
            placeholder="Tell people about yourself and what content you create..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={bioMaxLength}
            rows={4}
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="ghost" onClick={onPrevious} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!displayName || !bio || !category}
          className="gap-2"
        >
          Save & Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
