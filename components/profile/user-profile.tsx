"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Settings,
  Share2,
  MoreHorizontal,
  UserPlus,
  UserCheck,
  MessageCircle,
  Flag,
  Ban,
  Heart,
  MessageSquare,
  Eye,
  Play,
  Lock,
  Crown,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  usersAPI,
  UserProfileData,
  ProfilePost,
  ProfileStory,
  ProfileMoment,
} from "@/lib/api/endpoints/users";
import { followsAPI } from "@/lib/api/endpoints/follows";
import { useAuthStore } from "@/store/auth.store";

interface UserProfileProps {
  username: string;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen pb-20">
      <Skeleton className="h-48 md:h-64 w-full rounded-none" />
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="h-32 w-32 rounded-full border-4 border-background flex-shrink-0" />
          <div className="flex-1 pt-4 space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-full max-w-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Posts tab ───────────────────────────────────────────────────────────────
function PostsList({
  posts,
  isSubscribed,
  creatorId,
}: {
  posts: ProfilePost[];
  isSubscribed: boolean;
  creatorId: string;
}) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">No posts yet</p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {posts.map((post) => {
        if (post.isLocked && !isSubscribed) {
          return (
            <div
              key={post.id}
              className="border rounded-xl overflow-hidden bg-card relative"
            >
              {/* Blurred placeholder content */}
              <div className="p-4 space-y-3 select-none pointer-events-none blur-sm">
                <div className="space-y-2">
                  <div className="h-3 bg-muted-foreground/20 rounded w-3/4" />
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
                </div>
                <div className="aspect-video rounded-lg bg-gradient-to-br from-muted to-muted-foreground/20" />
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" />
                    {formatCount(post.likesCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {formatCount(post.commentsCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {formatCount(post.viewsCount)}
                  </span>
                  <span className="ml-auto">
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>

              {/* Lock overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60 backdrop-blur-sm rounded-xl">
                <div className="bg-primary/10 border border-primary/20 rounded-full p-3">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div className="text-center px-4">
                  <p className="font-semibold text-sm">Subscribers Only</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Subscribe to unlock this post
                  </p>
                </div>
                <Link href={`/subscribe/${creatorId}`}>
                  <Button size="sm" className="gap-2 mt-1">
                    Subscribe to unlock
                  </Button>
                </Link>
              </div>
            </div>
          );
        }

        return (
          <div
            key={post.id}
            className="border rounded-xl p-4 space-y-3 bg-card"
          >
            {post.content && (
              <p className="text-sm whitespace-pre-wrap">{post.content}</p>
            )}

            {post.images.length > 0 && (
              <div
                className={`grid gap-1 ${
                  post.images.length === 1
                    ? "grid-cols-1"
                    : post.images.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-3"
                }`}
              >
                {post.images.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {formatCount(post.likesCount)}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {formatCount(post.commentsCount)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {formatCount(post.viewsCount)}
              </span>
              <span className="ml-auto">
                {format(new Date(post.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Media tab (stories + moments) ───────────────────────────────────────────
function MediaGrid({
  stories,
  moments,
}: {
  stories: ProfileStory[];
  moments: ProfileMoment[];
}) {
  const allMedia = [
    ...stories.map((s) => ({ type: "story" as const, item: s })),
    ...moments.map((m) => ({ type: "moment" as const, item: m })),
  ].sort(
    (a, b) =>
      new Date(b.item.createdAt).getTime() -
      new Date(a.item.createdAt).getTime()
  );

  if (allMedia.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">No media yet</p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {allMedia.map(({ type, item }) => {
        const thumb =
          type === "story"
            ? (item as ProfileStory).thumbnailUrl ??
              (item as ProfileStory).mediaUrl
            : (item as ProfileMoment).thumbnailUrl ?? null;

        return (
          <div
            key={item.id}
            className="relative aspect-square bg-muted rounded overflow-hidden group"
          >
            {thumb ? (
              <Image src={thumb} alt="" fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20" />
            )}

            {/* Moment play icon */}
            {type === "moment" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-2">
                  <Play className="h-4 w-4 text-white fill-white" />
                </div>
              </div>
            )}

            {/* Hover overlay with stats */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-semibold">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {formatCount(item.viewsCount)}
              </span>
              {"likesCount" in item && (
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  {formatCount((item as ProfileMoment).likesCount)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function UserProfile({ username }: UserProfileProps) {
  const { user: currentUser } = useAuthStore();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const profile = profileData?.user ?? null;
  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    setIsLoading(true);
    setNotFound(false);
    setProfileData(null);

    usersAPI
      .getProfileByUsername(username)
      .then((data) => setProfileData(data))
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true);
      })
      .finally(() => setIsLoading(false));
  }, [username]);

  const handleFollow = async () => {
    if (!profileData || !profile || isFollowLoading) return;

    const wasFollowing = profileData.isFollowing;
    setProfileData({
      ...profileData,
      isFollowing: !wasFollowing,
      user: {
        ...profile,
        followersCount: wasFollowing
          ? profile.followersCount - 1
          : profile.followersCount + 1,
      },
    });
    setIsFollowLoading(true);

    try {
      if (wasFollowing) {
        await followsAPI.unfollowUser(profile.id);
        toast.success("Unfollowed");
      } else {
        await followsAPI.followUser(profile.id);
        toast.success("Following!");
      }
    } catch {
      setProfileData({ ...profileData });
      toast.error("Action failed. Please try again.");
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied!");
  };

  if (isLoading) return <ProfileSkeleton />;

  if (notFound || !profile || !profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-bold">User not found</h2>
        <p className="text-muted-foreground">
          No account exists for <span className="font-medium">@{username}</span>
        </p>
        <Link href="/feed">
          <Button>Back to Feed</Button>
        </Link>
      </div>
    );
  }

  const isCreator = profile.role === "CREATOR" || profile.role === "ADMIN";
  console.log("isCreator", profile);
  const joinedDate = (() => {
    try {
      return format(new Date(profile.createdAt), "MMMM yyyy");
    } catch {
      return null;
    }
  })();

  return (
    <div className="min-h-screen pb-20">
      {/* Banner */}
      <div
        className="h-48 md:h-64 bg-gradient-to-r from-primary/20 to-primary/10 bg-cover bg-center"
        style={
          profile.banner
            ? { backgroundImage: `url(${profile.banner})` }
            : undefined
        }
      />

      <div className="container mx-auto px-4 -mt-16 md:-mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Avatar */}
          <Avatar className="h-32 w-32 border-4 border-background ring-2 ring-primary flex-shrink-0">
            <AvatarImage
              src={
                profile.avatar ??
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`
              }
              alt={profile.name}
            />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {profile.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                {/* Name + badges */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {profile.name}
                  </h1>
                  {profile.isVerified && (
                    <Badge className="bg-blue-500 text-white text-xs">
                      ✓ Verified
                    </Badge>
                  )}
                  {isCreator && <Badge variant="secondary">Creator</Badge>}
                </div>

                <p className="text-muted-foreground mb-3">
                  @{profile.username}
                </p>

                {/* Stats */}
                <div className="flex gap-6 mb-4 flex-wrap">
                  <div>
                    <span className="font-bold">
                      {formatCount(profile.postsCount)}
                    </span>
                    <span className="text-muted-foreground ml-1 text-sm">
                      posts
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">
                      {formatCount(profile.followersCount)}
                    </span>
                    <span className="text-muted-foreground ml-1 text-sm">
                      followers
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">
                      {formatCount(profile.followingCount)}
                    </span>
                    <span className="text-muted-foreground ml-1 text-sm">
                      following
                    </span>
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && <p className="mb-3 text-sm">{profile.bio}</p>}

                {/* Joined */}
                {joinedDate && (
                  <p className="text-sm text-muted-foreground">
                    Joined {joinedDate}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {isOwnProfile ? (
                  <>
                    <Link href="/settings">
                      <Button variant="outline" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant={profileData.isFollowing ? "outline" : "default"}
                      onClick={handleFollow}
                      disabled={isFollowLoading}
                      className="gap-2"
                    >
                      {profileData.isFollowing ? (
                        <>
                          <UserCheck className="h-4 w-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          Follow
                        </>
                      )}
                    </Button>

                    {profileData.isSubscribed ? (
                      <Button
                        variant="outline"
                        className="gap-2 border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                      >
                        <Crown className="h-4 w-4" />
                        Subscribed
                      </Button>
                    ) : (
                      <Link href={`/subscribe/${profile.id}`}>
                        <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                          <Crown className="h-4 w-4" />
                          Subscribe
                        </Button>
                      </Link>
                    )}

                    <Link href="/messages">
                      <Button variant="outline" size="icon">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleShare}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Flag className="h-4 w-4 mr-2" />
                          Report User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Ban className="h-4 w-4 mr-2" />
                          Block User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="posts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Posts ({profileData.posts.length})
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Media ({profileData.stories.length + profileData.moments.length})
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <PostsList
              posts={profileData.posts}
              isSubscribed={profileData.isSubscribed}
              creatorId={profile.id}
            />
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <MediaGrid
              stories={profileData.stories}
              moments={profileData.moments}
            />
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="max-w-2xl space-y-4">
              {profile.bio && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Bio
                  </h4>
                  <p>{profile.bio}</p>
                </div>
              )}
              {joinedDate && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Joined
                  </h4>
                  <p>{joinedDate}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Role
                </h4>
                <p className="capitalize">{profile.role.toLowerCase()}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
