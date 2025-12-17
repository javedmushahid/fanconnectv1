'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Send, MoreVertical, Phone, Video, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import EmptyState from '@/components/ui/empty-state'

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState('1')
  const [messageInput, setMessageInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasMessages = true // Set to false to show empty state

  const conversations = [
    {
      id: '1',
      user: {
        name: 'Jane Doe',
        username: 'janedoe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      },
      lastMessage: 'Thanks for subscribing! 💕',
      timestamp: '2m ago',
      unread: 2,
    },
    {
      id: '2',
      user: {
        name: 'John Smith',
        username: 'johnsmith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      },
      lastMessage: 'Looking forward to your next post!',
      timestamp: '1h ago',
      unread: 0,
    },
  ]

  const messages = [
    {
      id: '1',
      senderId: '1',
      content: 'Hey! Love your content 😊',
      timestamp: '10:30 AM',
      isMine: false,
    },
    {
      id: '2',
      senderId: 'me',
      content: 'Thank you so much! That means a lot 💕',
      timestamp: '10:32 AM',
      isMine: true,
    },
    {
      id: '3',
      senderId: '1',
      content: 'Will you be posting more workout videos soon?',
      timestamp: '10:33 AM',
      isMine: false,
    },
    {
      id: '4',
      senderId: 'me',
      content: 'Yes! I have a new series coming next week. Stay tuned!',
      timestamp: '10:35 AM',
      isMine: true,
    },
    {
      id: '5',
      senderId: '1',
      content: 'Thanks for subscribing! 💕',
      timestamp: '10:36 AM',
      isMine: false,
    },
    {
      id: '6',
      senderId: 'me',
      content: 'Looking forward to it! 🎉',
      timestamp: '10:37 AM',
      isMine: true,
    },
    {
      id: '7',
      senderId: '1',
      content: 'Also, do you have any meal prep tips?',
      timestamp: '10:38 AM',
      isMine: false,
    },
    {
      id: '8',
      senderId: 'me',
      content: 'Absolutely! I\'ll create a detailed post about that this week.',
      timestamp: '10:39 AM',
      isMine: true,
    },
    {
      id: '9',
      senderId: '1',
      content: 'Perfect! Can\'t wait to see it 💪',
      timestamp: '10:40 AM',
      isMine: false,
    },
    {
      id: '10',
      senderId: 'me',
      content: 'Thanks for your support! It really motivates me to keep creating 😊',
      timestamp: '10:41 AM',
      isMine: true,
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedChat])

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput)
      setMessageInput('')
      // Scroll to bottom after sending
      setTimeout(scrollToBottom, 100)
    }
  }

  const selectedConversation = conversations.find((c) => c.id === selectedChat)

  if (!hasMessages) {
    return (
      <div className="h-[calc(100vh-12rem)] flex items-center justify-center">
        <EmptyState
          icon={MessageSquare}
          title="No Messages Yet"
          description="Start a conversation with your favorite creators. Subscribe to creators to unlock messaging!"
          actionLabel="Explore Creators"
          onAction={() => window.location.href = '/explore'}
          gradient="from-blue-500 to-cyan-500"
        />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-10rem)]">
      <Card className="h-full flex flex-col sm:flex-row overflow-hidden">
        {/* Conversations List */}
        <div className={`${selectedChat && 'hidden sm:flex'} sm:w-80 border-r flex flex-col h-full`}>
          <div className="p-4 border-b space-y-4 flex-shrink-0">
            <h2 className="text-xl font-bold">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search messages..." className="pl-10" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 hover:bg-muted transition-colors ${
                    selectedChat === conversation.id ? 'bg-muted' : ''
                  }`}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                    <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium truncate">{conversation.user.name}</p>
                      <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <Badge className="ml-2">{conversation.unread}</Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="sm:hidden"
                  onClick={() => setSelectedChat('')}
                >
                  ←
                </Button>
                <Avatar>
                  <AvatarImage src={selectedConversation.user.avatar} />
                  <AvatarFallback>{selectedConversation.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedConversation.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    @{selectedConversation.user.username}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages - Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.isMine
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input - Fixed at Bottom */}
            <div className="p-4 border-t flex-shrink-0 bg-background">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex flex-1 items-center justify-center">
            <EmptyState
              icon={MessageSquare}
              title="Select a Conversation"
              description="Choose a conversation from the list to start messaging"
              gradient="from-blue-500 to-purple-500"
            />
          </div>
        )}
      </Card>
    </div>
  )
}
