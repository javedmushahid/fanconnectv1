'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  Settings,
  MoreVertical,
  StopCircle,
  Volume2,
  VolumeX,
  MessageSquareOff,
  MessageSquare,
  Users,
  Activity,
  TrendingUp,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface CreatorStreamControlsProps {
  streamId: string
}

export default function CreatorStreamControls({ streamId }: CreatorStreamControlsProps) {
  const router = useRouter()
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [chatEnabled, setChatEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)

  const handleEndStream = () => {
    toast.success('Stream ended successfully')
    setShowEndDialog(false)
    router.push('/streaming/dashboard')
  }

  const toggleChat = () => {
    setChatEnabled(!chatEnabled)
    toast.success(chatEnabled ? 'Chat disabled' : 'Chat enabled')
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
    toast.success(audioEnabled ? 'Audio muted' : 'Audio unmuted')
  }

  return (
    <>
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Creator Controls
              </CardTitle>
              <CardDescription>
                Manage your live stream
              </CardDescription>
            </div>
            <Link href="/streaming/dashboard" target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stream Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-background p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Viewers</span>
              </div>
              <p className="text-xl font-bold">1,247</p>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12%
              </p>
            </div>

            <div className="bg-background p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="h-4 w-4 text-purple-500" />
                <span className="text-xs text-muted-foreground">Messages</span>
              </div>
              <p className="text-xl font-bold">342</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>

            <div className="bg-background p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Health</span>
              </div>
              <Badge className="bg-green-500 text-white text-xs">
                Excellent
              </Badge>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div className="flex items-center gap-2">
                {chatEnabled ? (
                  <MessageSquare className="h-4 w-4 text-green-500" />
                ) : (
                  <MessageSquareOff className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">Chat</span>
              </div>
              <Button
                variant={chatEnabled ? 'default' : 'outline'}
                size="sm"
                onClick={toggleChat}
              >
                {chatEnabled ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div className="flex items-center gap-2">
                {audioEnabled ? (
                  <Volume2 className="h-4 w-4 text-blue-500" />
                ) : (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">Audio</span>
              </div>
              <Button
                variant={audioEnabled ? 'default' : 'outline'}
                size="sm"
                onClick={toggleAudio}
              >
                {audioEnabled ? 'On' : 'Off'}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              asChild
            >
              <Link href="/streaming/dashboard">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Users className="h-4 w-4 mr-2" />
                  View Viewers
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Activity className="h-4 w-4 mr-2" />
                  Stream Health
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* End Stream Button */}
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={() => setShowEndDialog(true)}
          >
            <StopCircle className="h-4 w-4" />
            End Stream
          </Button>
        </CardContent>
      </Card>

      {/* End Stream Dialog */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Stream?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end this stream? Your {1247} viewers will be
              disconnected and you won't be able to resume this stream.
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
    </>
  )
}
