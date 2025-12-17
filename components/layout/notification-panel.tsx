'use client'

import { useState } from 'react'
import { Bell, Heart, MessageCircle, UserPlus, DollarSign, Check, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'subscribe' | 'payment' | 'mention'
  user: {
    name: string
    username: string
    avatar: string
  }
  content: string
  postPreview?: string
  amount?: number
  timestamp: string
  isRead: boolean
}

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'subscribe',
      user: {
        name: 'Alex Turner',
        username: 'alexturner',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      },
      content: 'subscribed to your content',
      timestamp: '2m ago',
      isRead: false,
    },
    {
      id: '2',
      type: 'like',
      user: {
        name: 'Emma Davis',
        username: 'emmad',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      },
      content: 'liked your post',
      postPreview: 'Just finished my morning workout! 💪',
      timestamp: '15m ago',
      isRead: false,
    },
    {
      id: '3',
      type: 'comment',
      user: {
        name: 'Mike Chen',
        username: 'mikechen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      },
      content: 'commented: "This is amazing! Keep it up! 🔥"',
      postPreview: 'New workout routine video',
      timestamp: '1h ago',
      isRead: false,
    },
    {
      id: '4',
      type: 'payment',
      user: {
        name: 'Sarah Johnson',
        username: 'sarahj',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      },
      content: 'sent you a tip',
      amount: 10,
      timestamp: '2h ago',
      isRead: true,
    },
    {
      id: '5',
      type: 'subscribe',
      user: {
        name: 'David Martinez',
        username: 'davidm',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      },
      content: 'subscribed to your content',
      timestamp: '3h ago',
      isRead: true,
    },
  ])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500 fill-red-500" />
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'subscribe':
        return <UserPlus className="h-4 w-4 text-green-500" />
      case 'payment':
        return <DollarSign className="h-4 w-4 text-yellow-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-muted/80 group">
          <Bell className="h-5 w-5 group-hover:text-primary transition-colors" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-pink-600 to-red-600 border-0 animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-[380px] p-0 glass backdrop-blur-xl bg-background/95"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Bell className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {unreadCount} unread
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={markAllAsRead}
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-muted rounded-full mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 transition-colors cursor-pointer group",
                    !notification.isRead && "bg-primary/5"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    {/* Avatar with icon badge */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={notification.user.avatar} />
                        <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 ring-2 ring-background">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm">
                          <span className="font-semibold hover:underline">
                            {notification.user.name}
                          </span>{' '}
                          <span className="text-muted-foreground">
                            {notification.content}
                          </span>
                          {notification.amount && (
                            <span className="font-semibold text-green-600">
                              {' '}${notification.amount}
                            </span>
                          )}
                        </p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>

                      {/* Post preview */}
                      {notification.postPreview && (
                        <div className="text-xs text-muted-foreground bg-muted rounded p-2 line-clamp-1">
                          {notification.postPreview}
                        </div>
                      )}

                      {/* Timestamp */}
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3">
              <Button 
                variant="ghost" 
                className="w-full text-primary hover:bg-primary/10"
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
