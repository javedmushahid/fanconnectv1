"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Share2,
  MoreHorizontal,
  UserPlus,
  UserCheck,
  MessageCircle,
  Bell,
  BellOff,
  Flag,
  Ban,
  Link as LinkIcon,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import PostCard from "@/components/feed/post-card";
import ProfileHighlights from "@/components/profile/profile-highlights";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface UserProfileProps {
  username: string;
}

const MOCK_USER = {
  id: "fitnessguru",
  username: "fitnessguru",
  displayName: "Fitness Guru",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessGuru",
  banner:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&h=400&fit=crop",
  bio: "Certified personal trainer helping you achieve your fitness goals 💪 | Online coaching | Meal plans",
  location: "Los Angeles, CA",
  website: "fitnessbyGuru.com",
  joinedDate: "January 2023",
  isVerified: true,
  isFollowing: false,
  hasNotifications: true,
  isCreator: true,
  category: "Fitness",
  stats: {
    posts: 342,
    followers: 12500,
    following: 428,
    subscribers: 1240,
  },
  subscriptionPrice: 9.99,
};

export default function UserProfile({ username }: UserProfileProps) {
  const [user, setUser] = useState(MOCK_USER);
  const [activeTab, setActiveTab] = useState("posts");

  const isOwnProfile = username === "janedoe";

  const handleFollow = () => {
    setUser({ ...user, isFollowing: !user.isFollowing });
    toast.success(user.isFollowing ? "Unfollowed" : "Following!");
  };

  const handleNotifications = () => {
    setUser({ ...user, hasNotifications: !user.hasNotifications });
    toast.success(
      user.hasNotifications
        ? "Notifications turned off"
        : "Notifications turned on"
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied!");
  };

  return (
    <div className="min-h-screen pb-20">
      <div
        className="h-48 md:h-64 bg-gradient-to-r from-primary/20 to-primary/10 bg-cover bg-center"
        style={{ backgroundImage: `url(${user.banner})` }}
      />

      <div className="container mx-auto px-4 -mt-16 md:-mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Avatar className="h-32 w-32 border-4 border-background ring-2 ring-primary">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.displayName[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {user.displayName}
                  </h1>
                  {user.isVerified && (
                    <Badge className="bg-blue-500 text-white">✓</Badge>
                  )}
                  {user.isCreator && <Badge variant="secondary">Creator</Badge>}
                </div>
                <p className="text-muted-foreground mb-2">@{user.username}</p>

                <div className="flex gap-6 mb-4">
                  <div>
                    <span className="font-bold">{user.stats.posts}</span>
                    <span className="text-muted-foreground ml-1">posts</span>
                  </div>
                  <div>
                    <span className="font-bold">
                      {user.stats.followers.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      followers
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">{user.stats.following}</span>
                    <span className="text-muted-foreground ml-1">
                      following
                    </span>
                  </div>
                </div>

                <p className="mb-2">{user.bio}</p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {user.category && (
                    <Badge variant="secondary">{user.category}</Badge>
                  )}
                  {user.website && (
                    <a
                      href={"https://" + user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      <LinkIcon className="h-4 w-4" />
                      {user.website}
                    </a>
                  )}
                  <span>Joined {user.joinedDate}</span>
                </div>
              </div>

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
                    {user.isCreator && (
                      <Link href={`/subscribe/${user.id}`}>
                        <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
                          <DollarSign className="h-4 w-4" />
                          Subscribe ${user.subscriptionPrice}/mo
                        </Button>
                      </Link>
                    )}

                    <Button
                      variant={user.isFollowing ? "outline" : "default"}
                      onClick={handleFollow}
                      className="gap-2"
                    >
                      {user.isFollowing ? (
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

                    <Link href="/messages">
                      <Button variant="outline" size="icon">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNotifications}
                    >
                      {user.hasNotifications ? (
                        <Bell className="h-4 w-4" />
                      ) : (
                        <BellOff className="h-4 w-4" />
                      )}
                    </Button>

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

        {/* Highlights Section */}
        <div className="mb-6">
          <ProfileHighlights isOwnProfile={isOwnProfile} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="posts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Media
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-center text-muted-foreground py-12">
                Posts will appear here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <div className="grid grid-cols-3 gap-1">
              <p className="col-span-3 text-center text-muted-foreground py-12">
                Media will appear here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="max-w-2xl">
              <h3 className="font-semibold mb-4">About</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Bio
                  </h4>
                  <p>{user.bio}</p>
                </div>
                {user.location && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Location
                    </h4>
                    <p>{user.location}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Joined
                  </h4>
                  <p>{user.joinedDate}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
