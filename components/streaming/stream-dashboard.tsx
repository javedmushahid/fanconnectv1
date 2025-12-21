'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import {
  Video,
  Users,
  Clock,
  Activity,
  TrendingUp,
  MessageCircle,
  Flag,
  Ban,
  Heart,
  Eye,
  Signal,
  MoreVertical,
  Settings,
  ExternalLink,
  Trash2,
  StopCircle,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface ChatMessage {
  id: string
  user: {
    username: string
    avatar: string
  }
  message: string
  timestamp: number
}

export default function StreamDashboard() {
  const [isLive, setIsLive] = useState(true)
  const [viewers, setViewers] = useState(1247)
  const [duration, setDuration] = useState(2700) // 45 minutes in seconds
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: { username: 'user123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1' },
      message: 'Great stream!',
      timestamp: Date.now() - 30000,
    },
    {
      id: '2',
      user: { username: 'fitfan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2' },
      message: 'Love the energy 🔥',
      timestamp: Date.now() - 20000,
    },
  ])

  // Simulate real-time viewer updates
  useEffect(() => {
    if (!isLive) return

    const viewerInterval = setInterval(() => {
      setViewers((prev) => Math.max(0, prev + Math.floor(Math.random() * 10) - 5))
    }, 3000)

    const durationInterval = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)

    const chatInterval = setInterval(() => {
      const messages = [
        'This is awesome!',
        'Keep it up! 💪',
        'Great content!',
        'Love this stream!',
      ]
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: {
          username: `user${Math.floor(Math.random() * 1000)}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        },
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp: Date.now(),
      }
      setChatMessages((prev) => [...prev.slice(-9), newMessage])
    }, 10000)

    return () => {
      clearInterval(viewerInterval)
      clearInterval(durationInterval)
      clearInterval(chatInterval)
    }
  }, [isLive])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleEndStream = () => {
    setIsLive(false)
    toast.success('Stream ended successfully')
    setShowEndDialog(false)
  }

  const streamHealth = viewers > 1000 ? 'excellent' : viewers > 500 ? 'good' : 'fair'

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            Stream Dashboard
            {isLive && (
              <Badge className="bg-red-600 text-white animate-pulse">
                🔴 LIVE
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Manage your active stream and engage with your audience
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/streaming/create">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Stream Settings
            </Button>
          </Link>
          {isLive && (
            <Button
              variant="destructive"
              onClick={() => setShowEndDialog(true)}
              className="gap-2"
            >
              <StopCircle className="h-4 w-4" />
              End Stream
            </Button>
          )}
        </div>
      </div>

      {isLive ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Stream Card */}
            <Card className="border-2 border-red-500/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">Morning Workout Routine 🔥</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="secondary">Fitness</Badge>
                      <span>•</span>
                      <span>Started {formatDuration(duration)} ago</span>
                    </CardDescription>
                  </div>
                  <Link href="/streaming/stream-123" target="_blank">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View Stream
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <span className="text-sm text-muted-foreground">Viewers</span>
                    </div>
                    <p className="text-2xl font-bold">{viewers.toLocaleString()}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      +12%
                    </p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-purple-500" />
                      <span className="text-sm text-muted-foreground">Duration</span>
                    </div>
                    <p className="text-2xl font-bold">{formatDuration(duration)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Live time</p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span className="text-sm text-muted-foreground">Likes</span>
                    </div>
                    <p className="text-2xl font-bold">856</p>
                    <p className="text-xs text-muted-foreground mt-1">Total reactions</p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-muted-foreground">Messages</span>
                    </div>
                    <p className="text-2xl font-bold">342</p>
                    <p className="text-xs text-muted-foreground mt-1">Chat activity</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stream Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Stream Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Connection</span>
                      <Badge className="bg-green-500">Stable</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Signal className="h-4 w-4 text-green-500" />
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
                      </div>
                      <span className="text-xs font-medium">95%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Bitrate</span>
                      <Badge variant="secondary">4500 kbps</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                      <span className="text-xs font-medium">85%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Quality</span>
                      <Badge className="bg-purple-500">1080p</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-purple-500" />
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }} />
                      </div>
                      <span className="text-xs font-medium">HD</span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  streamHealth === 'excellent' 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : streamHealth === 'good'
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                }`}>
                  <p className={`text-sm font-medium ${
                    streamHealth === 'excellent' 
                      ? 'text-green-900 dark:text-green-100' 
                      : streamHealth === 'good'
                      ? 'text-blue-900 dark:text-blue-100'
                      : 'text-yellow-900 dark:text-yellow-100'
                  }`}>
                    {streamHealth === 'excellent' && '✅ Stream health is excellent! Your viewers are having a great experience.'}
                    {streamHealth === 'good' && '👍 Stream is running smoothly with good performance.'}
                    {streamHealth === 'fair' && '⚠️ Stream is stable but consider checking your connection.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Chat Moderation */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chat Moderation</CardTitle>
                <CardDescription>Monitor and moderate your chat</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 group"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.user.avatar} />
                          <AvatarFallback>{msg.user.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{msg.user.username}</p>
                          <p className="text-sm text-muted-foreground break-words">
                            {msg.message}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Flag className="h-4 w-4 mr-2" />
                              Flag Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Message
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Ban className="h-4 w-4 mr-2" />
                              Ban User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Send Chat Announcement
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  View All Viewers
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  Stream Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                <Video className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No Active Stream</h3>
              <p className="text-muted-foreground">
                You're not currently streaming. Start a new stream to see your dashboard.
              </p>
              <Link href="/streaming/create">
                <Button className="gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
                  <Video className="h-4 w-4" />
                  Start New Stream
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* End Stream Dialog */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Stream?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end this stream? Your viewers will be disconnected
              and you won't be able to resume this stream.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEndStream}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              End Stream
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
