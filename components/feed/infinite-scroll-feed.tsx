"use client";

import { useState, useEffect, useRef } from "react";
import PostCardWithComments from "./post-card-with-comments";
import PostSkeleton from "./post-skeleton";
import { Post } from "@/types";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { postsAPI, FeedPost } from "@/lib/api/endpoints/posts";
import { useAuth } from "@/hooks/use-auth";

const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const mapFeedPost = (feedPost: FeedPost): Post => ({
  id: feedPost.id,
  creatorId: feedPost.authorId,
  creator: {
    id: feedPost.user.id,
    email: "",
    username: feedPost.user.username,
    displayName: feedPost.user.name,
    bio: "",
    avatar: feedPost.user.avatar || "",
    banner: "",
    role: "creator",
    isVerified: false,
    createdAt: "",
  },
  content: feedPost.content || "",
  mediaUrls: feedPost.images,
  mediaType: feedPost.images.length > 0 ? "image" : "text",
  isLocked: feedPost.isLocked,
  price: feedPost.ppvPrice ?? undefined,
  likesCount: feedPost.likesCount,
  commentsCount: feedPost.commentsCount,
  isLiked: feedPost.isLiked,
  createdAt: formatRelativeTime(feedPost.createdAt),
});

export default function InfiniteScrollFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Load initial posts
  useEffect(() => {
    loadMorePosts(true);
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, page]);

  const loadMorePosts = async (isInitial = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const { posts: newFeedPosts, pagination } = await postsAPI.getFeed(page, 20);
      const newPosts = newFeedPosts
        .filter((p) => p.authorId !== user?.id)
        .map(mapFeedPost);
      setPosts((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);
      setHasMore(pagination.hasNextPage ?? page < pagination.totalPages);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number; data: unknown }; message?: string };
      console.error("[Feed] Error loading posts:", axiosErr?.response?.status, axiosErr?.response?.data ?? axiosErr?.message);
      setError("Failed to load posts. Please try again.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
      if (isInitial) setInitialLoading(false);
    }
  };
  // Show skeleton on initial load
  if (initialLoading) {
    return (
      <div className="space-y-6">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <Card className="p-8 text-center space-y-4">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" onClick={() => loadMorePosts(true)}>
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <div key={index}>
          <PostCardWithComments post={post} isSubscribed={false} />
        </div>
      ))}

      {/* Error loading more */}
      {error && posts.length > 0 && (
        <Card className="p-4 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

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
              You've seen all the latest posts. Check back later for more
              content!
            </p>
          </div>
        </Card>
      )}

      {/* Intersection observer target */}
      <div ref={observerTarget} className="h-4" />
    </div>
  );
}
