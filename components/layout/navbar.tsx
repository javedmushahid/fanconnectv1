'use client'
import Link from 'next/link'
import { MessageCircle, Search, Menu, X, Home, User, Settings, LogOut, Compass, Bookmark, Heart, Upload, DollarSign, Users, BarChart3, Sun, Moon, Monitor, Video, Film, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import NotificationPanel from '@/components/layout/notification-panel'
import SearchDropdown from '@/components/layout/search-dropdown'
import GoLiveModal from '@/components/streaming/go-live-modal'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/store/auth.store'
import { useMessageStore } from '@/store/message.store'
import { tokenManager } from '@/lib/auth/token-manager'

export default function Navbar() {
  const { user, logout, isInitialized } = useAuthStore()
  const messageUnreadCount = useMessageStore((s) => s.unreadCount)
  const isLoggedIn = !!user
  const isCreator = user?.role === 'CREATOR' || user?.role === 'ADMIN'
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [showGoLive, setShowGoLive] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    tokenManager.stop()
    await logout()
    router.push('/login')
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo + Menu Button (Mobile) */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-muted/80"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
              </Button>
              <Link href="/feed" className="flex items-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <h1 className="relative text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                    FanConnect
                  </h1>
                </div>
              </Link>
            </div>

            {/* Center: Search Bar (Desktop & Tablet) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchDropdown className="w-full" />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Go Live Button */}
              {isLoggedIn && isCreator && (
                <Button
                  onClick={() => setShowGoLive(true)}
                  className="hidden sm:flex gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                  size="sm"
                >
                  <Video className="h-4 w-4" />
                  <span className="hidden lg:inline">Go Live</span>
                </Button>
              )}

              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* Search Icon (Mobile) */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-muted/80"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {!isInitialized ? (
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              ) : isLoggedIn ? (
                <>
                  {/* Messages */}
                  <Link href="/messages">
                    <Button variant="ghost" size="icon" className="relative hover:bg-muted/80 group">
                      <MessageCircle className="h-5 w-5 group-hover:text-primary transition-colors" />
                      {messageUnreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-blue-600 to-purple-600 border-0 animate-pulse">
                          {messageUnreadCount > 99 ? '99+' : messageUnreadCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  {/* Notification Panel */}
                  <NotificationPanel />

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/50 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-0 hover:opacity-50 transition-opacity"></div>
                        <Avatar className="h-10 w-10 relative ring-2 ring-primary/20">
                          <AvatarImage src={user?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} alt={`@${user?.username}`} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 glass backdrop-blur-xl bg-background/95" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">@{user?.username}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/80">
                        <Link href={`/${user?.username}`} className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/80">
                        <Link href="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/login" className="hidden sm:block">
                    <Button variant="ghost" className="hover:bg-muted/80">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
                      Sign Up
                    </Button>
                    <Button size="sm" className="sm:hidden bg-gradient-to-r from-blue-600 to-purple-600">
                      Join
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          {mobileSearchOpen && (
            <div className="md:hidden pb-4 animate-in slide-in-from-top">
              <SearchDropdown
                className="w-full"
                autoFocus
                onResultClick={() => setMobileSearchOpen(false)}
              />
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-[100] animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="lg:hidden fixed inset-y-0 left-0 right-0 bg-background z-[101] animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-4 h-16 border-b bg-muted/30">
              <h2 className="text-lg font-bold">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:bg-muted"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="h-[calc(100vh-4rem)] overflow-y-auto pb-20">
              <div className="px-4 py-6 space-y-6">
                {/* Go Live Button - Mobile */}
                {isLoggedIn && isCreator && (
                  <>
                    <Button
                      onClick={() => {
                        setShowGoLive(true)
                        setMobileMenuOpen(false)
                      }}
                      className="w-full gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white h-12"
                    >
                      <Video className="h-5 w-5" />
                      Go Live
                    </Button>
                    <Separator />
                  </>
                )}

                {/* Main Navigation */}
                <div className="space-y-2">
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Main Menu
                  </p>
                  <Link href="/feed" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12 hover:bg-muted/80">
                      <Home className="mr-3 h-5 w-5" />
                      Home
                    </Button>
                  </Link>
                  <Link href="/stories" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12 hover:bg-muted/80">
                      <Film className="mr-3 h-5 w-5" />
                      Stories
                    </Button>
                  </Link>
                  <Link href="/explore" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12 hover:bg-muted/80">
                      <Compass className="mr-3 h-5 w-5" />
                      Explore
                    </Button>
                  </Link>
                  <Link href="/subscriptions" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12 hover:bg-muted/80">
                      <Heart className="mr-3 h-5 w-5" />
                      Subscriptions
                    </Button>
                  </Link>
                  <Link href="/saved" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12 hover:bg-muted/80">
                      <Bookmark className="mr-3 h-5 w-5" />
                      Saved
                    </Button>
                  </Link>
                </div>

                <Separator />

                {/* Creator Studio */}
                <div className="space-y-2">
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Creator Studio
                  </p>
                  <Link href="/creator/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12 hover:bg-muted/80">
                      <BarChart3 className="mr-3 h-5 w-5" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/analytics/overview" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12 hover:bg-muted/80">
                      <TrendingUp className="mr-3 h-5 w-5" />
                      Analytics
                    </Button>
                  </Link>
                  <Link href="/creator/upload" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12 hover:bg-muted/80">
                      <Upload className="mr-3 h-5 w-5" />
                      Upload Content
                    </Button>
                  </Link>
                  <Link href="/creator/earnings" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12 hover:bg-muted/80">
                      <DollarSign className="mr-3 h-5 w-5" />
                      Earnings
                    </Button>
                  </Link>
                  <Link href="/creator/subscribers" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12 hover:bg-muted/80">
                      <Users className="mr-3 h-5 w-5" />
                      Subscribers
                    </Button>
                  </Link>
                </div>

                <Separator />

                {/* Account Settings */}
                <div className="space-y-2">
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Account
                  </p>
                  <Link href={`/${user?.username}`} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12 hover:bg-muted/80">
                      <User className="mr-3 h-5 w-5" />
                      My Profile
                    </Button>
                  </Link>
                  <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-base h-12 hover:bg-muted/80">
                      <Settings className="mr-3 h-5 w-5" />
                      Settings
                    </Button>
                  </Link>
                </div>

                <Separator />

                {/* Theme Selection */}
                <div className="space-y-2">
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Theme
                  </p>
                  <Button
                    variant={theme === 'light' ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-base h-12"
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="mr-3 h-5 w-5" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-base h-12"
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="mr-3 h-5 w-5" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-base h-12"
                    onClick={() => setTheme('system')}
                  >
                    <Monitor className="mr-3 h-5 w-5" />
                    System
                  </Button>
                </div>

                <Separator />
                
                {/* Logout */}
                {isLoggedIn ? (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-base h-12 text-destructive hover:bg-destructive/10"
                    onClick={() => { setMobileMenuOpen(false); handleLogout() }}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Log Out
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-12">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Go Live Modal */}
      <GoLiveModal open={showGoLive} onClose={() => setShowGoLive(false)} />
    </>
  )
}
