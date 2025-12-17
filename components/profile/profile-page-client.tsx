'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Link as LinkIcon, Heart, MessageCircle } from 'lucide-react'
import PostCardWithComments from '@/components/feed/post-card-with-comments'
import EditProfileModal from '@/components/profile/edit-profile-modal'
import { Post } from '@/types'

export default function ProfilePageClient({ username }: { username: string }) {
  const [showEditModal, setShowEditModal] = useState(false)

  const user = {
    id: '1',
    username: username,
    displayName: 'Jane Doe',
    email: 'jane@example.com',
    bio: 'Fitness enthusiast & wellness coach 💪 | Helping you achieve your health goals | DM for coaching',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    banner: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop',
    role: 'creator' as const,
    isVerified: true,
    createdAt: 'January 2024',
    location: 'Los Angeles, CA',
    website: 'https://janedoe.com',
    subscriberCount: 1234,
    postCount: 456,
    likesReceived: 12543,
  }

  const isOwnProfile = true
  const isSubscribed = false

  const mockPosts: Post[] = [
    {
      id: '1',
      creatorId: '1',
      creator: {
        id: '1',
        email: 'jane@example.com',
        username: username,
        displayName: user.displayName,
        bio: user.bio,
        avatar: user.avatar,
        banner: user.banner,
        role: 'creator',
        isVerified: true,
        createdAt: user.createdAt,
      },
      content: 'Morning workout complete! 💪 Sharing my routine with you all.',
      mediaUrls: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800'],
      mediaType: 'image',
      isLocked: false,
      likesCount: 234,
      commentsCount: 12,
      createdAt: '2h ago',
    },
  ]

  return (
    <>
      <div className="space-y-6 -mx-4 sm:mx-0">
        {/* Banner */}
        <div className="relative w-full h-48 sm:h-64 lg:h-80 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient"></div>
          {user.banner && (
            <img
              src={user.banner}
              alt="Profile banner"
              className="w-full h-full object-cover mix-blend-overlay opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        </div>

        {/* Profile Info */}
        <div className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-6 -mt-20 sm:-mt-24 relative z-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <Avatar className="relative h-32 w-32 sm:h-40 sm:w-40 border-4 border-background shadow-2xl ring-4 ring-primary/20">
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user.displayName[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            <Card className="flex-1 p-6 glass border-2 backdrop-blur-xl bg-background/80">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {user.displayName}
                    </h1>
                    {user.isVerified && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 border-0">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">@{user.username}</p>
                  
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="font-bold text-lg">{user.postCount}</span>{' '}
                      <span className="text-muted-foreground">Posts</span>
                    </div>
                    <div>
                      <span className="font-bold text-lg">{user.subscriberCount}</span>{' '}
                      <span className="text-muted-foreground">Subscribers</span>
                    </div>
                    <div>
                      <span className="font-bold text-lg">{user.likesReceived}</span>{' '}
                      <span className="text-muted-foreground">Likes</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowEditModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Edit Profile
                </Button>
              </div>

              <p className="text-sm sm:text-base mt-4 leading-relaxed">{user.bio}</p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {user.website.replace('https://', '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {user.createdAt}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-6">
          <Tabs defaultValue="posts">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
              {mockPosts.map((post) => (
                <PostCardWithComments key={post.id} post={post} isSubscribed={isSubscribed} />
              ))}
            </TabsContent>

            <TabsContent value="media">Media grid here</TabsContent>
            <TabsContent value="about">About section here</TabsContent>
          </Tabs>
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
      />
    </>
  )
}
