'use client'

import { useState, useEffect, useRef } from 'react'
import PostCardWithComments from './post-card-with-comments'
import PostSkeleton from './post-skeleton'
import { Post } from '@/types'
import { Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'

// Generate mock posts
const generateMockPosts = (page: number): Post[] => {
  const creators = [
    {
      id: '1',
      email: 'jane@example.com',
      username: 'jane_doe',
      displayName: 'Jane Doe',
      bio: 'Fitness enthusiast & wellness coach',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      banner: '',
      role: 'creator' as const,
      isVerified: true,
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      email: 'john@example.com',
      username: 'fitness_pro',
      displayName: 'Fitness Pro',
      bio: 'Professional trainer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      banner: '',
      role: 'creator' as const,
      isVerified: true,
      createdAt: '2024-01-01',
    },
    {
      id: '3',
      email: 'sarah@example.com',
      username: 'yoga_sarah',
      displayName: 'Sarah Miller',
      bio: 'Yoga instructor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      banner: '',
      role: 'creator' as const,
      isVerified: true,
      createdAt: '2024-01-01',
    },
  ]

  const contents = [
    'Just finished my morning workout! 💪 Who else is staying active today?',
    'New workout routine dropping tomorrow! Stay tuned 🔥',
    'Healthy meal prep tips for the week ahead 🥗',
    'Transform your body in 30 days with this program!',
    'Morning yoga flow to start your day right ☀️',
    'Exclusive content for my subscribers! 🎯',
  ]

  const images = [
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
  ]

  return Array.from({ length: 5 }, (_, i) => {
    const postId = `${page}-${i}`
    const creator = creators[i % creators.length]
    const isLocked = Math.random() > 0.7

    return {
      id: postId,
      creatorId: creator.id,
      creator: creator,
      content: contents[i % contents.length],
      mediaUrls: [images[i % images.length]],
      mediaType: 'image' as const,
      isLocked: isLocked,
      price: isLocked ? 9.99 : undefined,
      likesCount: Math.floor(Math.random() * 500) + 50,
      commentsCount: Math.floor(Math.random() * 50) + 5,
      createdAt: `${i + 1}h ago`,
    }
  })
}

export default function InfiniteScrollFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)

  // Load initial posts
  useEffect(() => {
    loadMorePosts(true)
  }, [])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading, page])

  const loadMorePosts = async (isInitial = false) => {
    if (loading) return

    setLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, isInitial ? 800 : 1000))

    const newPosts = generateMockPosts(page)
    setPosts((prev) => [...prev, ...newPosts])
    setPage((prev) => prev + 1)

    // Stop loading after 5 pages (25 posts)
    if (page >= 5) {
      setHasMore(false)
    }

    setLoading(false)
    if (isInitial) setInitialLoading(false)
  }

  // Show skeleton on initial load
  if (initialLoading) {
    return (
      <div className="space-y-6">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id}>
          <PostCardWithComments post={post} isSubscribed={false} />
        </div>
      ))}

      {/* Loading indicator */}
      {loading && (
        <Card className="p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm font-medium">Loading more posts...</p>
          </div>
        </Card>
      )}

      {/* End of feed message */}
      {!hasMore && posts.length > 0 && (
        <Card className="p-8 text-center">
          <div className="space-y-3">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-50"></div>
              <div className="relative text-4xl">🎉</div>
            </div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              You're All Caught Up!
            </h3>
            <p className="text-sm text-muted-foreground">
              You've seen all the latest posts. Check back later for more content!
            </p>
          </div>
        </Card>
      )}

      {/* Intersection observer target */}
      <div ref={observerTarget} className="h-4" />
    </div>
  )
}
