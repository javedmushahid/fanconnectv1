import CreatePost from '@/components/feed/create-post'
import HeroSection from '@/components/feed/hero-section'
import InfiniteScrollFeed from '@/components/feed/infinite-scroll-feed'

export default function FeedPage() {
  return (
    <div className="space-y-6">
      <HeroSection />
      <CreatePost />
      <InfiniteScrollFeed />
    </div>
  )
}
