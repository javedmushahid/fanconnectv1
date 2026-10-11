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
  Eye,
  Play,
  Crown,
  Loader2,
} from "lucide-react";
import PostCardWithComments from "@/components/feed/post-card-with-comments";
import { Post } from "@/types";
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
  ProfileUser,
  ProfilePost,
  ProfileStory,
  ProfileMoment,
} from "@/lib/api/endpoints/users";
import { followsAPI, FollowUser, FollowPagination } from "@/lib/api/endpoints/follows";
import { subscriptionsAPI } from "@/lib/api/endpoints/subscriptions";
import { useAuthStore } from "@/store/auth.store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
};

function PostsList({
  posts,
  isSubscribed,
  profile,
}: {
  posts: ProfilePost[];
  isSubscribed: boolean;
  profile: ProfileUser;
}) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">No posts yet</p>
    );
  }

  const mappedPosts: Post[] = posts.map((post) => ({
    id: post.id,
    creatorId: profile.id,
    creator: {
      id: profile.id,
      email: "",
      username: profile.username,
      displayName: profile.name,
      bio: profile.bio ?? "",
      avatar: profile.avatar ?? "",
      banner: profile.banner ?? "",
      role: "creator" as const,
      isVerified: profile.isVerified ?? false,
      createdAt: profile.createdAt,
    },
    content: post.content ?? "",
    mediaUrls: post.images,
    mediaType: post.images.length > 0 ? ("image" as const) : ("text" as const),
    isLocked: post.isLocked,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    isLiked: post.isLiked,
    createdAt: formatRelativeTime(post.createdAt),
  }));
  console.log("mappedPosts", mappedPosts);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {mappedPosts.map((post) => (
        <PostCardWithComments
          key={post.id}
          post={post}
          isSubscribed={isSubscribed}
        />
      ))}
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

// ─── Followers / Following dialog ────────────────────────────────────────────
function FollowListDialog({
  userId,
  type,
  isOpen,
  onClose,
}: {
  userId: string;
  type: "followers" | "following";
  isOpen: boolean;
  onClose: () => void;
}) {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [pagination, setPagination] = useState<FollowPagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPage = async (page: number, append: boolean) => {
    const fetcher = type === "followers"
      ? followsAPI.getFollowers(userId, page)
      : followsAPI.getFollowing(userId, page);
    const result = await fetcher;
    setUsers((prev) => append ? [...prev, ...result.users] : result.users);
    setPagination(result.pagination);
  };

  useEffect(() => {
    if (!isOpen) return;
    setUsers([]);
    setPagination(null);
    setLoading(true);
    fetchPage(1, false).catch(() => setUsers([])).finally(() => setLoading(false));
  }, [isOpen, userId, type]);

  const handleLoadMore = async () => {
    if (!pagination || pagination.page >= pagination.totalPages) return;
    setLoadingMore(true);
    fetchPage(pagination.page + 1, true).finally(() => setLoadingMore(false));
  };

  const hasMore = pagination ? pagination.page < pagination.totalPages : false;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {type}
            {pagination && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({pagination.total})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">
              No {type} yet
            </p>
          ) : (
            <>
              {users.map((u) => (
                <Link
                  key={u.id}
                  href={`/${u.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={u.avatar ?? ""} alt={u.name} />
                    <AvatarFallback>{u.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground truncate">@{u.username}</p>
                    {u.bio && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{u.bio}</p>
                    )}
                  </div>
                </Link>
              ))}
              {hasMore && (
                <div className="pt-2 pb-1 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="text-xs text-muted-foreground"
                  >
                    {loadingMore ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
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
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [followDialog, setFollowDialog] = useState<"followers" | "following" | null>(null);

  const profile = profileData?.user ?? null;
  const isOwnProfile = currentUser?.username === username;
  console.log("profileData", profile);
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

  const handleSubscribedClick = async () => {
    if (!profile) return;
    if (!subscriptionId) {
      try {
        const { subscription } = await subscriptionsAPI.checkSubscription(
          profile.id
        );
        if (subscription?.id) setSubscriptionId(subscription.id);
      } catch {
        toast.error("Could not load subscription details.");
        return;
      }
    }
    setShowCancelDialog(true);
  };

  const handleCancelSubscription = async () => {
    if (!subscriptionId || !profileData) return;
    setIsCanceling(true);
    try {
      const { endsAt } = await subscriptionsAPI.cancelSubscription(
        subscriptionId
      );
      setProfileData({
        ...profileData,
        subscriptionCancelAtPeriodEnd: true,
        subscriptionEndsAt: endsAt,
      });
      toast.success("Subscription will end at the end of the billing period.");
    } catch {
      toast.error("Failed to cancel subscription.");
    } finally {
      setIsCanceling(false);
      setShowCancelDialog(false);
    }
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
  console.log("profileData", profileData);
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
                  <button
                    onClick={() => setFollowDialog("followers")}
                    className="hover:opacity-70 transition-opacity text-left"
                  >
                    <span className="font-bold">
                      {formatCount(profile.followersCount)}
                    </span>
                    <span className="text-muted-foreground ml-1 text-sm">
                      followers
                    </span>
                  </button>
                  <button
                    onClick={() => setFollowDialog("following")}
                    className="hover:opacity-70 transition-opacity text-left"
                  >
                    <span className="font-bold">
                      {formatCount(profile.followingCount)}
                    </span>
                    <span className="text-muted-foreground ml-1 text-sm">
                      following
                    </span>
                  </button>
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
                      profileData.subscriptionCancelAtPeriodEnd ? (
                        <div className="relative group">
                          <Button
                            variant="outline"
                            className="gap-2 border-orange-400 text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 cursor-default"
                          >
                            <Crown className="h-4 w-4" />
                            Canceling
                          </Button>
                          {profileData.subscriptionEndsAt && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 text-xs bg-popover text-popover-foreground border rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                              Access until{" "}
                              {format(
                                new Date(profileData.subscriptionEndsAt),
                                "MMM d, yyyy"
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="gap-2 border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                          onClick={handleSubscribedClick}
                        >
                          <Crown className="h-4 w-4" />
                          Subscribed
                        </Button>
                      )
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
              profile={profile}
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

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll keep access until the end of your current billing period.
              After that, you'll lose access to exclusive content from{" "}
              <span className="font-medium text-foreground">
                {profile.name}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCanceling}>
              Keep Subscription
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              disabled={isCanceling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCanceling ? "Canceling…" : "Yes, Cancel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {followDialog && (
        <FollowListDialog
          userId={profile.id}
          type={followDialog}
          isOpen={!!followDialog}
          onClose={() => setFollowDialog(null)}
        />
      )}
    </div>
  );
}
