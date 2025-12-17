'use client'

import { Compass, Search, TrendingUp, Sparkles } from 'lucide-react'
import EmptyState from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function ExplorePage() {
  const trendingCreators = [
    {
      id: '1',
      name: 'Sarah Johnson',
      username: 'sarahj',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      category: 'Fitness',
      subscribers: '12.5K',
      isVerified: true,
      bio: 'Personal trainer helping you achieve your fitness goals 💪',
    },
    {
      id: '2',
      name: 'Mike Chen',
      username: 'mikechen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      category: 'Cooking',
      subscribers: '8.3K',
      isVerified: true,
      bio: 'Chef sharing delicious recipes and cooking tips ��‍🍳',
    },
    {
      id: '3',
      name: 'Emma Davis',
      username: 'emmad',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      category: 'Art',
      subscribers: '15.2K',
      isVerified: true,
      bio: 'Digital artist creating stunning illustrations 🎨',
    },
    {
      id: '4',
      name: 'Alex Turner',
      username: 'alexturner',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      category: 'Music',
      subscribers: '20.1K',
      isVerified: true,
      bio: 'Musician & producer sharing my journey 🎵',
    },
    {
      id: '5',
      name: 'Lisa Wang',
      username: 'lisaw',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
      category: 'Fashion',
      subscribers: '18.7K',
      isVerified: true,
      bio: 'Fashion designer & style influencer ✨',
    },
    {
      id: '6',
      name: 'David Martinez',
      username: 'davidm',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      category: 'Tech',
      subscribers: '25.3K',
      isVerified: true,
      bio: 'Tech reviewer & software developer 💻',
    },
  ]

  const newCreators = [
    {
      id: '7',
      name: 'Sophie Brown',
      username: 'sophieb',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
      category: 'Lifestyle',
      subscribers: '1.2K',
      isVerified: false,
      bio: 'Sharing my daily life and adventures 🌟',
    },
    {
      id: '8',
      name: 'James Wilson',
      username: 'jamesw',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      category: 'Gaming',
      subscribers: '2.5K',
      isVerified: false,
      bio: 'Gamer streaming daily content 🎮',
    },
  ]

  const categories = [
    { name: 'Fitness', count: 234, icon: '💪', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Cooking', count: 189, icon: '👨‍🍳', gradient: 'from-orange-500 to-red-500' },
    { name: 'Art', count: 312, icon: '��', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Music', count: 276, icon: '🎵', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Fashion', count: 198, icon: '✨', gradient: 'from-pink-500 to-rose-500' },
    { name: 'Tech', count: 421, icon: '💻', gradient: 'from-indigo-500 to-blue-500' },
    { name: 'Gaming', count: 356, icon: '🎮', gradient: 'from-violet-500 to-purple-500' },
    { name: 'Lifestyle', count: 289, icon: '🌟', gradient: 'from-amber-500 to-yellow-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Explore
          </h1>
          <p className="text-muted-foreground">Discover amazing creators and content</p>
        </div>
        <div className="hidden sm:block">
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Suggest Creators
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Search creators, categories, or tags..."
          className="pl-10 bg-muted/50 backdrop-blur-sm"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="trending" className="flex-1 sm:flex-none">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="new" className="flex-1 sm:flex-none">
            <Sparkles className="h-4 w-4 mr-2" />
            New
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex-1 sm:flex-none">
            <Compass className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
        </TabsList>

        {/* Trending Creators */}
        <TabsContent value="trending" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trendingCreators.map((creator) => (
              <Card 
                key={creator.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                        <AvatarImage src={creator.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {creator.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {creator.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                          <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{creator.name}</h3>
                      <p className="text-sm text-muted-foreground">@{creator.username}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{creator.category}</Badge>
                        <span className="text-sm text-muted-foreground">{creator.subscribers}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{creator.bio}</p>
                  <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* New Creators */}
        <TabsContent value="new" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {newCreators.map((creator) => (
              <Card 
                key={creator.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                      <AvatarImage src={creator.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {creator.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{creator.name}</h3>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-xs">
                          New
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">@{creator.username}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{creator.category}</Badge>
                        <span className="text-sm text-muted-foreground">{creator.subscribers}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{creator.bio}</p>
                  <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600">
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Categories */}
        <TabsContent value="categories" className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Card 
                key={category.name}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <div className="relative inline-block">
                      <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                      <div className={`relative text-5xl p-4 bg-gradient-to-r ${category.gradient} rounded-full inline-block`}>
                        <span className="filter drop-shadow-lg">{category.icon}</span>
                      </div>
                    </div>
                    <h3 className={`text-xl font-bold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} creators
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-muted transition-colors"
                    >
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
