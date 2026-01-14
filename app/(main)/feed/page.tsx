"use client";

import CreatePost from "@/components/feed/create-post";
import InfiniteScrollFeed from "@/components/feed/infinite-scroll-feed";
import LiveNowSection from "@/components/streaming/live-now-section";
import StoryRings from "@/components/stories/story-rings";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/hooks/use-auth";

export default function FeedPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="space-y-6 overflow-x-hidden">
        <StoryRings />

        {user && (
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-lg">Welcome back, {user.name}!</p>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        )}

        <LiveNowSection />
        <CreatePost />
        <InfiniteScrollFeed />
      </div>
    </ProtectedRoute>
  );
}
