'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Send, Smile, MoreVertical, Flag, Reply } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  user: {
    id: string
    username: string
    displayName: string
    avatar: string
    badges?: ('subscriber' | 'moderator' | 'vip')[]
  }
  message: string
  timestamp: number // Changed from Date to number
  isSuperChat?: boolean
  superChatAmount?: number
}

interface StreamChatProps {
  streamId: string
  compact?: boolean
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      username: 'fitfan123',
      displayName: 'Fit Fan',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fan1',
      badges: ['subscriber'],
    },
    message: 'Great workout! 💪',
    timestamp: Date.now() - 120000,
  },
  {
    id: '2',
    user: {
      id: 'user2',
      username: 'healthguru',
      displayName: 'Health Guru',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guru',
      badges: ['subscriber', 'vip'],
    },
    message: 'Love this routine! Been following for 6 months now 🙌',
    timestamp: Date.now() - 90000,
  },
  {
    id: '3',
    user: {
      id: 'user3',
      username: 'newbie',
      displayName: 'Newbie',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=New',
    },
    message: 'How many reps should I do?',
    timestamp: Date.now() - 60000,
  },
  {
    id: '4',
    user: {
      id: 'mod1',
      username: 'moderator',
      displayName: 'Moderator',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mod',
      badges: ['moderator'],
    },
    message: 'Remember to stay hydrated everyone! 💧',
    timestamp: Date.now() - 45000,
  },
  {
    id: '5',
    user: {
      id: 'user5',
      username: 'supporter',
      displayName: 'Big Supporter',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Support',
      badges: ['subscriber'],
    },
    message: 'Amazing content as always! Keep it up! 🔥🔥🔥',
    timestamp: Date.now() - 30000,
    isSuperChat: true,
    superChatAmount: 10,
  },
  {
    id: '6',
    user: {
      id: 'user6',
      username: 'gymrat',
      displayName: 'Gym Rat',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gym',
    },
    message: 'This is exactly what I needed today!',
    timestamp: Date.now() - 15000,
  },
]

export default function StreamChat({ streamId, compact = false }: StreamChatProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [newMessage, setNewMessage] = useState('')
  const [isClient, setIsClient] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const maxMessageLength = 200

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const mockMessages = [
        'This is awesome!',
        'Great stream! 🎉',
        'Keep going!',
        'Love the energy!',
        'Thanks for streaming!',
      ]
      
      const newMsg: Message = {
        id: Date.now().toString(),
        user: {
          id: `user${Date.now()}`,
          username: `user${Math.floor(Math.random() * 1000)}`,
          displayName: `User ${Math.floor(Math.random() * 1000)}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        },
        message: mockMessages[Math.floor(Math.random() * mockMessages.length)],
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, newMsg])
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      user: {
        id: 'currentUser',
        username: 'janedoe',
        displayName: 'Jane Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        badges: ['subscriber'],
      },
      message: newMessage,
      timestamp: Date.now(),
    }

    setMessages([...messages, message])
    setNewMessage('')
    toast.success('Message sent!')
  }

  const getSuperChatGradient = (amount?: number) => {
    if (!amount) return ''
    if (amount >= 100) return 'from-purple-500 to-pink-500'
    if (amount >= 50) return 'from-orange-500 to-red-500'
    if (amount >= 25) return 'from-yellow-500 to-orange-500'
    if (amount >= 10) return 'from-blue-500 to-cyan-500'
    return 'from-green-500 to-emerald-500'
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'subscriber':
        return 'bg-green-500'
      case 'moderator':
        return 'bg-blue-500'
      case 'vip':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatTime = (timestamp: number) => {
    if (!isClient) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getRelativeTime = (timestamp: number) => {
    if (!isClient) return 'just now'
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  return (
    <div className={`flex flex-col ${compact ? 'h-64' : 'h-full'} bg-background`}>
      {/* Chat Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Live Chat</h3>
            <p className="text-xs text-muted-foreground">
              {messages.length} messages
            </p>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`group ${
                msg.isSuperChat
                  ? `bg-gradient-to-r ${getSuperChatGradient(
                      msg.superChatAmount
                    )} p-3 rounded-lg text-white`
                  : ''
              }`}
            >
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={msg.user.avatar} />
                  <AvatarFallback>{msg.user.displayName[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold text-sm truncate ${
                      msg.isSuperChat ? 'text-white' : ''
                    }`}>
                      {msg.user.displayName}
                    </span>
                    {msg.user.badges?.map((badge) => (
                      <Badge
                        key={badge}
                        className={`${getBadgeColor(badge)} text-white text-xs px-1.5 py-0`}
                      >
                        {badge}
                      </Badge>
                    ))}
                    {isClient && (
                      <span className={`text-xs ${
                        msg.isSuperChat ? 'text-white/80' : 'text-muted-foreground'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    )}
                  </div>

                  {msg.isSuperChat && msg.superChatAmount && (
                    <Badge className="bg-white/20 text-white mb-1 text-xs">
                      ${msg.superChatAmount}
                    </Badge>
                  )}

                  <p className={`text-sm mt-1 break-words ${
                    msg.isSuperChat ? 'text-white' : ''
                  }`}>
                    {msg.message}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="space-y-2">
          <div className="relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Send a message..."
              maxLength={maxMessageLength}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {newMessage.length}/{maxMessageLength}
            </span>
            <Button
              type="submit"
              size="sm"
              disabled={!newMessage.trim()}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          Be respectful and follow chat rules
        </p>
      </div>
    </div>
  )
}
