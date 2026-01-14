"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Users,
  UserPlus,
  Search,
  Send,
  ArrowLeft,
  MessageCircle,
  CheckCheck,
  Check,
  X,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";
import { useMessaging } from "@/hooks/use-messaging";
import type { FollowUser } from "@/lib/api/endpoints/follows";
import { cn } from "@/lib/utils";

const MessagingPage = () => {
  const {
    messages,
    isConnected,
    isTyping,
    recipient,
    onlineUsers,
    followers,
    following,
    loadingFollowers,
    loadingFollowing,
    currentUser,
    startConversation,
    sendMessage,
    handleTyping,
    resetConversation,
    isUserOnline,
  } = useMessaging();

  const [showUserSelection, setShowUserSelection] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  console.log("isUserOnline", recipient);
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when conversation opens
  useEffect(() => {
    if (!showUserSelection && recipient) {
      inputRef.current?.focus();
    }
  }, [showUserSelection, recipient]);

  const filterUsers = (users: FollowUser[]) => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u &&
        u.name &&
        u.username &&
        (u.name.toLowerCase().includes(query) ||
          u.username.toLowerCase().includes(query))
    );
  };

  const handleSelectUser = async (user: FollowUser) => {
    await startConversation(user);
    setShowUserSelection(false);
  };

  const handleBack = () => {
    resetConversation();
    setShowUserSelection(true);
    setMessageText("");
    setSearchQuery("");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || sending || !isConnected) return;

    setSending(true);
    try {
      await sendMessage(messageText);
      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="flex flex-col h-dvh bg-gradient-to-br from-background via-muted/10 to-background">
        <div className="flex flex-col lg:flex-row h-full max-w-7xl w-full mx-auto overflow-hidden">
          {/* Sidebar - User List */}
          <div
            className={cn(
              "w-full lg:w-96 border-r bg-card/50 backdrop-blur-sm flex flex-col",
              !showUserSelection && "hidden lg:flex"
            )}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={currentUser.avatar || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {currentUser.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-base truncate">
                      Messages
                    </h2>
                    <p className="text-xs text-muted-foreground truncate">
                      @{currentUser.username}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={isConnected ? "default" : "destructive"}
                  className="text-xs"
                >
                  {isConnected ? "Online" : "Offline"}
                </Badge>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
            </div>

            {/* User Tabs */}
            <Tabs
              defaultValue="following"
              className="flex-1 flex flex-col overflow-hidden"
            >
              <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
                <TabsTrigger value="following" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Following
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 px-1.5 text-xs"
                  >
                    {following.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="followers" className="gap-2">
                  <Users className="h-4 w-4" />
                  Followers
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 px-1.5 text-xs"
                  >
                    {followers.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="following"
                className="flex-1 m-0 overflow-hidden"
              >
                <ScrollArea className="h-full px-4">
                  {loadingFollowing ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : filterUsers(following).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                      <UserPlus className="h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p className="text-sm text-muted-foreground">
                        {searchQuery
                          ? "No users found"
                          : "Not following anyone yet"}
                      </p>
                      {!searchQuery && (
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          Start following people to message them
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1 py-2">
                      {filterUsers(following).map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          className="w-full group"
                        >
                          <Card className="p-3 hover:bg-accent/50 transition-all duration-200 cursor-pointer border-transparent hover:border-border hover:shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                                <Avatar className="h-11 w-11 border-2 border-background group-hover:border-primary/20 transition-colors">
                                  <AvatarImage src={user.avatar || undefined} />
                                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                    {user.name?.charAt(0).toUpperCase() || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                {isUserOnline(user.id) && (
                                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm truncate">
                                    {user.name || "Unknown"}
                                  </p>
                                  {isUserOnline(user.id) && (
                                    <Badge
                                      variant="secondary"
                                      className="h-4 px-1.5 text-[10px]"
                                    >
                                      Online
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                  @{user.username || "unknown"}
                                </p>
                                {user.bio && (
                                  <p className="text-xs text-muted-foreground/80 truncate mt-0.5">
                                    {user.bio}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Card>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent
                value="followers"
                className="flex-1 m-0 overflow-hidden"
              >
                <ScrollArea className="h-full px-4">
                  {loadingFollowers ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : filterUsers(followers).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                      <Users className="h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p className="text-sm text-muted-foreground">
                        {searchQuery ? "No users found" : "No followers yet"}
                      </p>
                      {!searchQuery && (
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          People who follow you will appear here
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1 py-2">
                      {filterUsers(followers).map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          className="w-full group"
                        >
                          <Card className="p-3 hover:bg-accent/50 transition-all duration-200 cursor-pointer border-transparent hover:border-border hover:shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                                <Avatar className="h-11 w-11 border-2 border-background group-hover:border-primary/20 transition-colors">
                                  <AvatarImage src={user.avatar || undefined} />
                                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                    {user.name?.charAt(0).toUpperCase() || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                {isUserOnline(user.id) && (
                                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm truncate">
                                    {user.name || "Unknown"}
                                  </p>
                                  {isUserOnline(user.id) && (
                                    <Badge
                                      variant="secondary"
                                      className="h-4 px-1.5 text-[10px]"
                                    >
                                      Online
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                  @{user.username || "unknown"}
                                </p>
                                {user.bio && (
                                  <p className="text-xs text-muted-foreground/80 truncate mt-0.5">
                                    {user.bio}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Card>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Main Chat Area */}
          <div
            className={cn(
              "flex-1 flex flex-col min-h-0 overflow-hidden bg-background/50 backdrop-blur-sm",
              showUserSelection && "hidden lg:flex"
            )}
          >
            {!recipient ? (
              // Empty state
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md space-y-4">
                  <div className="relative inline-block">
                    <MessageCircle className="h-24 w-24 text-muted-foreground/30" />
                    <div className="absolute -bottom-1 -right-1 bg-primary/10 rounded-full p-2">
                      <Send className="h-6 w-6 text-primary/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      Select a conversation
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Choose a contact from the sidebar to start messaging
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-hidden">
                {/* Chat Header - Fixed at top */}
                <div className="border-b bg-card/30 backdrop-blur-sm flex-shrink-0 z-10">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBack}
                        className="lg:hidden flex-shrink-0"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarImage src={recipient.avatar || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {recipient.name?.charAt(0).toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        {isUserOnline(recipient.id) && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-base truncate">
                          {recipient.name}
                        </h2>
                        <p className="text-xs text-muted-foreground truncate">
                          {isUserOnline(recipient.id) ? (
                            <span className="text-green-600 dark:text-green-500 flex items-center gap-1">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              Online
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></span>
                              Offline
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hidden sm:inline-flex"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hidden sm:inline-flex"
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages Area - Scrollable middle section */}
                <div className="flex-1 overflow-y-auto pb-2">
                  <div className="p-4 md:p-6">
                    <div className="max-w-4xl mx-auto space-y-4">
                      {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="bg-primary/5 rounded-full p-4 mb-4">
                            <MessageCircle className="h-8 w-8 text-primary/50" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            No messages yet
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            Start the conversation with {recipient.name}!
                          </p>
                        </div>
                      )}

                      {messages.map((msg, index) => {
                        if (!msg || !msg.id) return null;

                        const isSent = msg.senderId === currentUser.id;
                        const showAvatar =
                          index === 0 ||
                          messages[index - 1]?.senderId !== msg.senderId;
                        const isLastInGroup =
                          index === messages.length - 1 ||
                          messages[index + 1]?.senderId !== msg.senderId;

                        return (
                          <div
                            key={msg.id}
                            className={cn(
                              "flex gap-2 items-end",
                              isSent ? "justify-end" : "justify-start"
                            )}
                          >
                            {!isSent && (
                              <Avatar
                                className={cn(
                                  "h-7 w-7 flex-shrink-0",
                                  !showAvatar && "opacity-0"
                                )}
                              >
                                <AvatarImage
                                  src={recipient.avatar || undefined}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {recipient.name?.charAt(0).toUpperCase() ||
                                    "?"}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={cn(
                                "max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm",
                                isSent
                                  ? "bg-primary text-primary-foreground rounded-br-md"
                                  : "bg-card border rounded-bl-md",
                                !isLastInGroup && isSent && "rounded-br-2xl",
                                !isLastInGroup && !isSent && "rounded-bl-2xl"
                              )}
                            >
                              <p className="text-sm leading-relaxed break-words">
                                {msg.content || ""}
                              </p>
                              <div
                                className={cn(
                                  "flex items-center gap-1 mt-1 text-xs",
                                  isSent
                                    ? "text-primary-foreground/70 justify-end"
                                    : "text-muted-foreground"
                                )}
                              >
                                <span>
                                  {msg.createdAt
                                    ? new Date(
                                        msg.createdAt
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : ""}
                                </span>
                                {isSent && msg.status && (
                                  <span className="ml-1">
                                    {msg.status === "SENT" && (
                                      <Check className="h-3 w-3" />
                                    )}
                                    {msg.status === "DELIVERED" && (
                                      <CheckCheck className="h-3 w-3" />
                                    )}
                                    {msg.status === "READ" && (
                                      <CheckCheck className="h-3 w-3 text-blue-400" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                            {isSent && (
                              <Avatar
                                className={cn(
                                  "h-7 w-7 flex-shrink-0",
                                  !showAvatar && "opacity-0"
                                )}
                              >
                                <AvatarImage
                                  src={currentUser.avatar || undefined}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {currentUser.name?.charAt(0).toUpperCase() ||
                                    "U"}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        );
                      })}

                      {isTyping && (
                        <div className="flex gap-2 items-end">
                          <Avatar className="h-7 w-7 flex-shrink-0">
                            <AvatarImage src={recipient.avatar || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {recipient.name?.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-card border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                            <div className="flex gap-1">
                              <span
                                className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              ></span>
                              <span
                                className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              ></span>
                              <span
                                className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              ></span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </div>

                {/* Message Input - Fixed at bottom */}
                <div className="border-t bg-card/30 backdrop-blur-sm flex-shrink-0 z-10">
                  {!isConnected && (
                    <div className="px-4 pt-2">
                      <div className="bg-destructive/10 text-destructive text-xs py-2 px-3 rounded-lg flex items-center gap-2">
                        <X className="h-3 w-3" />
                        <span>Disconnected. Trying to reconnect...</span>
                      </div>
                    </div>
                  )}
                  <form onSubmit={handleSendMessage} className="p-4">
                    <div className="flex gap-2 items-end max-w-4xl mx-auto">
                      <div className="flex-1 relative">
                        <Input
                          ref={inputRef}
                          type="text"
                          value={messageText}
                          onChange={(e) => {
                            setMessageText(e.target.value);
                            handleTyping();
                          }}
                          placeholder={`Message ${recipient.name}...`}
                          className="pr-4 py-5 rounded-2xl bg-background border-border/50 focus:border-primary/50 resize-none"
                          disabled={sending || !isConnected}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e);
                            }
                          }}
                        />
                      </div>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={
                          !messageText.trim() || sending || !isConnected
                        }
                        className="h-11 w-11 rounded-2xl flex-shrink-0"
                      >
                        {sending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MessagingPage;
