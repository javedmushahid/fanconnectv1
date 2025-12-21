import CreatePost from "@/components/feed/create-post";
import HeroSection from "@/components/feed/hero-section";
import InfiniteScrollFeed from "@/components/feed/infinite-scroll-feed";
import LiveNowSection from "@/components/streaming/live-now-section";
import StoryRings from "@/components/stories/story-rings";

export default function FeedPage() {
  return (
    <div className="space-y-6 overflow-x-hidden">
      <StoryRings />
      {/* <HeroSection /> */}
      <LiveNowSection />
      <CreatePost />
      <InfiniteScrollFeed />
    </div>
  );
}
