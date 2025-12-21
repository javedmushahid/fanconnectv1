'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Video, 
  Upload, 
  Copy, 
  Eye, 
  EyeOff, 
  Calendar as CalendarIcon,
  Clock,
  Loader2,
  ArrowLeft,
  Info,
  CheckCircle2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'

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

export default function StreamSetup() {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)
  const [showStreamKey, setShowStreamKey] = useState(false)
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [scheduledDate, setScheduledDate] = useState<Date>()
  
  const [streamData, setStreamData] = useState({
    title: '',
    description: '',
    category: '',
    subscribersOnly: false,
    scheduled: false,
    scheduledTime: '',
  })

  // Mock stream credentials
  const streamKey = 'live_sk_' + Math.random().toString(36).substring(2, 15)
  const rtmpUrl = 'rtmps://live.fanconnect.com/live'

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnail(reader.result as string)
        toast.success('Thumbnail uploaded!')
      }
      reader.readAsDataURL(file)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const handleStartStream = async () => {
    if (!streamData.title.trim()) {
      toast.error('Please enter a stream title')
      return
    }

    if (!streamData.category) {
      toast.error('Please select a category')
      return
    }

    setIsStarting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const streamId = 'stream-' + Date.now()
    toast.success('Stream created! 🔴')
    
    if (streamData.scheduled) {
      toast.success('Stream scheduled successfully!')
      router.push('/creator/dashboard')
    } else {
      router.push(`/streaming/${streamId}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/creator/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
            <Video className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Setup Your Stream</h1>
            <p className="text-muted-foreground">
              Configure your stream settings and go live
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Stream Information</CardTitle>
              <CardDescription>
                Basic details about your stream
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={streamData.description}
                  onChange={(e) =>
                    setStreamData({ ...streamData, description: e.target.value })
                  }
                  placeholder="Tell your audience what this stream is about..."
                  className="min-h-[120px] resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {streamData.description.length}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Thumbnail */}
          <Card>
            <CardHeader>
              <CardTitle>Stream Thumbnail</CardTitle>
              <CardDescription>
                Upload a custom thumbnail for your stream
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {thumbnail ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    <img
                      src={thumbnail}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setThumbnail(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center justify-center py-8">
                      <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-sm font-medium mb-1">
                        Click to upload thumbnail
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 10MB (1280x720 recommended)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Scheduling</CardTitle>
              <CardDescription>
                Control who can watch and when to stream
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subscribers Only */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Subscribers Only</Label>
                  <p className="text-sm text-muted-foreground">
                    Only your subscribers can watch this stream
                  </p>
                </div>
                <Switch
                  checked={streamData.subscribersOnly}
                  onCheckedChange={(checked) =>
                    setStreamData({ ...streamData, subscribersOnly: checked })
                  }
                />
              </div>

              {/* Schedule Stream */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Schedule Stream</Label>
                    <p className="text-sm text-muted-foreground">
                      Schedule your stream for a specific date and time
                    </p>
                  </div>
                  <Switch
                    checked={streamData.scheduled}
                    onCheckedChange={(checked) =>
                      setStreamData({ ...streamData, scheduled: checked })
                    }
                  />
                </div>

                {streamData.scheduled && (
                  <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-primary">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !scheduledDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {scheduledDate ? (
                              format(scheduledDate, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={scheduledDate}
                            onSelect={setScheduledDate}
                            disabled={(date) =>
                              date < new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          value={streamData.scheduledTime}
                          onChange={(e) =>
                            setStreamData({
                              ...streamData,
                              scheduledTime: e.target.value,
                            })
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stream Credentials */}
          <Card>
            <CardHeader>
              <CardTitle>Stream Credentials</CardTitle>
              <CardDescription>
                Use these credentials in your streaming software (OBS, Streamlabs, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* RTMP URL */}
              <div className="space-y-2">
                <Label>RTMP Server URL</Label>
                <div className="flex gap-2">
                  <Input value={rtmpUrl} readOnly className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(rtmpUrl, 'RTMP URL')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stream Key */}
              <div className="space-y-2">
                <Label>Stream Key</Label>
                <div className="flex gap-2">
                  <Input
                    value={streamKey}
                    type={showStreamKey ? 'text' : 'password'}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowStreamKey(!showStreamKey)}
                  >
                    {showStreamKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(streamKey, 'Stream key')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-destructive flex items-start gap-1">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  Keep your stream key private! Anyone with this key can stream to your channel.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Preview & Actions */}
        <div className="space-y-6">
          {/* Stream Settings Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stream Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Quality</span>
                <span className="font-medium">1080p HD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Latency</span>
                <span className="font-medium">Low (~2s)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Audio</span>
                <span className="font-medium">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Chat</span>
                <span className="font-medium">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Privacy</span>
                <span className="font-medium">
                  {streamData.subscribersOnly ? 'Subscribers' : 'Public'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Internet Speed</p>
                  <p className="text-muted-foreground text-xs">
                    5+ Mbps upload recommended
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Streaming Software</p>
                  <p className="text-muted-foreground text-xs">
                    OBS Studio, Streamlabs, etc.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Equipment</p>
                  <p className="text-muted-foreground text-xs">
                    Camera & microphone
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button
            onClick={handleStartStream}
            disabled={isStarting}
            size="lg"
            className="w-full gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
          >
            {isStarting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {streamData.scheduled ? 'Scheduling...' : 'Starting Stream...'}
              </>
            ) : (
              <>
                <Video className="h-5 w-5" />
                {streamData.scheduled ? 'Schedule Stream' : 'Go Live Now'}
              </>
            )}
          </Button>

          {/* Help */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Need help?</strong> Check out our{' '}
                <Link href="/help/streaming" className="underline">
                  streaming guide
                </Link>{' '}
                for setup instructions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
