'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Search, Image, Video, TrendingUp, Eye, Heart, MessageCircle, DollarSign, Hash } from 'lucide-react'

// Mock Data
const TOP_POSTS = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=150&fit=crop',
    title: 'Morning Workout Routine - Full Body Training',
    type: 'video' as const,
    views: 45200,
    likes: 3400,
    comments: 567,
    revenue: 1250,
    engagement: 8.7,
    date: '2025-12-18',
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=150&fit=crop',
    title: 'Healthy Meal Prep Ideas for the Week',
    type: 'image' as const,
    views: 38900,
    likes: 2890,
    comments: 423,
    revenue: 980,
    engagement: 8.5,
    date: '2025-12-17',
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=150&fit=crop',
    title: 'Digital Art Tutorial - Landscape Painting',
    type: 'video' as const,
    views: 32100,
    likes: 2450,
    comments: 389,
    revenue: 870,
    engagement: 8.8,
    date: '2025-12-16',
  },
  {
    id: '4',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=150&fit=crop',
    title: 'Gaming Setup Tour 2025',
    type: 'image' as const,
    views: 28700,
    likes: 2100,
    comments: 312,
    revenue: 720,
    engagement: 8.4,
    date: '2025-12-15',
  },
  {
    id: '5',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=150&fit=crop',
    title: 'Fitness Tips for Beginners',
    type: 'video' as const,
    views: 25400,
    likes: 1950,
    comments: 287,
    revenue: 650,
    engagement: 8.8,
    date: '2025-12-14',
  },
]

const CONTENT_TYPE_BREAKDOWN = [
  { type: 'Videos', count: 156, percentage: 62, color: '#3b82f6' },
  { type: 'Images', count: 94, percentage: 38, color: '#ec4899' },
]

const POSTING_TIMES = [
  { hour: '12 AM', Mon: 12, Tue: 8, Wed: 15, Thu: 10, Fri: 14, Sat: 20, Sun: 18 },
  { hour: '3 AM', Mon: 5, Tue: 3, Wed: 7, Thu: 4, Fri: 6, Sat: 10, Sun: 8 },
  { hour: '6 AM', Mon: 18, Tue: 22, Wed: 25, Thu: 20, Fri: 24, Sat: 28, Sun: 26 },
  { hour: '9 AM', Mon: 35, Tue: 38, Wed: 42, Thu: 36, Fri: 40, Sat: 32, Sun: 30 },
  { hour: '12 PM', Mon: 45, Tue: 48, Wed: 52, Thu: 46, Fri: 50, Sat: 42, Sun: 40 },
  { hour: '3 PM', Mon: 52, Tue: 55, Wed: 58, Thu: 54, Fri: 56, Sat: 48, Sun: 45 },
  { hour: '6 PM', Mon: 68, Tue: 72, Wed: 75, Thu: 70, Fri: 73, Sat: 65, Sun: 62 },
  { hour: '9 PM', Mon: 55, Tue: 58, Wed: 62, Thu: 56, Fri: 60, Sat: 70, Sun: 68 },
]

const HASHTAG_PERFORMANCE = [
  { tag: '#fitness', posts: 45, totalViews: 234000, avgEngagement: 8.5 },
  { tag: '#workout', posts: 38, totalViews: 198000, avgEngagement: 8.2 },
  { tag: '#health', posts: 32, totalViews: 176000, avgEngagement: 7.9 },
  { tag: '#nutrition', posts: 28, totalViews: 145000, avgEngagement: 8.1 },
  { tag: '#motivation', posts: 25, totalViews: 132000, avgEngagement: 8.3 },
]

const CATEGORY_PERFORMANCE = [
  { category: 'Fitness & Health', posts: 85, views: 425000, engagement: 8.6 },
  { category: 'Cooking & Food', posts: 42, views: 218000, engagement: 8.3 },
  { category: 'Art & Design', posts: 38, views: 195000, engagement: 8.7 },
  { category: 'Gaming', posts: 35, views: 182000, engagement: 8.1 },
  { category: 'Lifestyle', posts: 28, views: 156000, engagement: 7.9 },
]

export default function ContentPerformance() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('views')
  const [filterType, setFilterType] = useState('all')

  const filteredPosts = TOP_POSTS.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || post.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Content Performance</h1>
        <p className="text-muted-foreground">
          Analyze your top-performing content and optimize your strategy
        </p>
      </div>

      {/* Top Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Posts</CardTitle>
          <CardDescription>Your best-performing content</CardDescription>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="views">Most Views</SelectItem>
                <SelectItem value="likes">Most Likes</SelectItem>
                <SelectItem value="comments">Most Comments</SelectItem>
                <SelectItem value="revenue">Highest Revenue</SelectItem>
                <SelectItem value="engagement">Best Engagement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Videos Only</SelectItem>
                <SelectItem value="image">Images Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Post</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Engagement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                          <Badge
                            variant="secondary"
                            className="absolute top-1 right-1 h-5 px-1"
                          >
                            {post.type === 'video' ? (
                              <Video className="h-3 w-3" />
                            ) : (
                              <Image className="h-3 w-3" />
                            )}
                          </Badge>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium line-clamp-2 text-sm">
                            {post.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {post.date}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {post.views.toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="font-medium">
                          {post.likes.toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{post.comments}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium">${post.revenue}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {post.engagement}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Content Type & Best Times */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Content Type Breakdown</CardTitle>
            <CardDescription>Distribution of your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {CONTENT_TYPE_BREAKDOWN.map((type) => (
                <div key={type.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {type.type === 'Videos' ? (
                        <Video className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Image className="h-4 w-4 text-pink-500" />
                      )}
                      <span className="font-medium">{type.type}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{type.percentage}%</p>
                      <p className="text-xs text-muted-foreground">
                        {type.count} posts
                      </p>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${type.percentage}%`,
                        backgroundColor: type.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Tip:</strong> Video content shows 23% higher engagement
                than images
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Best Posting Times */}
        <Card>
          <CardHeader>
            <CardTitle>Best Posting Times</CardTitle>
            <CardDescription>Peak engagement hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={POSTING_TIMES}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="hour"
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="Mon" fill="#ef4444" stackId="a" />
                <Bar dataKey="Tue" fill="#f97316" stackId="a" />
                <Bar dataKey="Wed" fill="#f59e0b" stackId="a" />
                <Bar dataKey="Thu" fill="#84cc16" stackId="a" />
                <Bar dataKey="Fri" fill="#10b981" stackId="a" />
                <Bar dataKey="Sat" fill="#06b6d4" stackId="a" />
                <Bar dataKey="Sun" fill="#8b5cf6" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-center text-muted-foreground mt-4">
              Best time to post: <strong>6-9 PM on weekdays</strong>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hashtag Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Hashtag Performance</CardTitle>
          <CardDescription>Top performing hashtags</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {HASHTAG_PERFORMANCE.map((hashtag, index) => (
              <div
                key={hashtag.tag}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge className="h-8 w-8 flex items-center justify-center p-0">
                    {index + 1}
                  </Badge>
                  <Hash className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">{hashtag.tag}</p>
                    <p className="text-xs text-muted-foreground">
                      {hashtag.posts} posts
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {(hashtag.totalViews / 1000).toFixed(0)}K views
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {hashtag.avgEngagement}% engagement
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>Performance by content category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead>Total Views</TableHead>
                  <TableHead>Avg Engagement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CATEGORY_PERFORMANCE.map((category) => (
                  <TableRow key={category.category}>
                    <TableCell className="font-medium">
                      {category.category}
                    </TableCell>
                    <TableCell>{category.posts}</TableCell>
                    <TableCell>
                      {(category.views / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {category.engagement}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
