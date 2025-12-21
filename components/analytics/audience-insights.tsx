'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Users, TrendingUp, Smartphone, Monitor, Tablet, Globe } from 'lucide-react'

// Mock Data
const FOLLOWER_GROWTH = [
  { date: 'Dec 14', followers: 8500 },
  { date: 'Dec 15', followers: 8750 },
  { date: 'Dec 16', followers: 9200 },
  { date: 'Dec 17', followers: 9400 },
  { date: 'Dec 18', followers: 9800 },
  { date: 'Dec 19', followers: 10100 },
  { date: 'Dec 20', followers: 10500 },
]

const SUBSCRIBER_GROWTH = [
  { date: 'Dec 14', subscribers: 1200 },
  { date: 'Dec 15', subscribers: 1350 },
  { date: 'Dec 16', subscribers: 1580 },
  { date: 'Dec 17', subscribers: 1720 },
  { date: 'Dec 18', subscribers: 1920 },
  { date: 'Dec 19', subscribers: 2100 },
  { date: 'Dec 20', subscribers: 2310 },
]

const AGE_BREAKDOWN = [
  { age: '13-17', count: 520 },
  { age: '18-24', count: 3200 },
  { age: '25-34', count: 4100 },
  { age: '35-44', count: 2400 },
  { age: '45-54', count: 1200 },
  { age: '55+', count: 580 },
]

const GENDER_BREAKDOWN = [
  { gender: 'Male', value: 45, count: 5400 },
  { gender: 'Female', value: 52, count: 6240 },
  { gender: 'Other', value: 3, count: 360 },
]

const TOP_LOCATIONS = [
  { country: 'United States', percentage: 35, count: 4200, flag: '🇺🇸' },
  { country: 'United Kingdom', percentage: 18, count: 2160, flag: '🇬🇧' },
  { country: 'Canada', percentage: 12, count: 1440, flag: '🇨🇦' },
  { country: 'Australia', percentage: 10, count: 1200, flag: '🇦🇺' },
  { country: 'Germany', percentage: 8, count: 960, flag: '🇩🇪' },
  { country: 'France', percentage: 7, count: 840, flag: '🇫🇷' },
  { country: 'Others', percentage: 10, count: 1200, flag: '🌍' },
]

const TOP_FANS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    username: '@sarahj',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    engagement: 95,
    interactions: 234,
  },
  {
    id: '2',
    name: 'Mike Chen',
    username: '@mikechen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    engagement: 92,
    interactions: 218,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    username: '@emmaw',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    engagement: 89,
    interactions: 201,
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    username: '@alexr',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    engagement: 87,
    interactions: 195,
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    username: '@lisaa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    engagement: 85,
    interactions: 189,
  },
]

const DEVICE_BREAKDOWN = [
  { device: 'Mobile', percentage: 68, icon: Smartphone, color: '#3b82f6' },
  { device: 'Desktop', percentage: 27, icon: Monitor, color: '#8b5cf6' },
  { device: 'Tablet', percentage: 5, icon: Tablet, color: '#ec4899' },
]

const BROWSER_BREAKDOWN = [
  { browser: 'Chrome', percentage: 52, users: 6240 },
  { browser: 'Safari', percentage: 28, users: 3360 },
  { browser: 'Firefox', percentage: 12, users: 1440 },
  { browser: 'Edge', percentage: 6, users: 720 },
  { browser: 'Other', percentage: 2, users: 240 },
]

const GENDER_COLORS = ['#3b82f6', '#ec4899', '#8b5cf6']

export default function AudienceInsights() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Audience Insights</h1>
        <p className="text-muted-foreground">
          Understand who your audience is and how they engage
        </p>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Follower Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Follower Growth</CardTitle>
            <CardDescription>Total followers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={FOLLOWER_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
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
                <Area
                  type="monotone"
                  dataKey="followers"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                +23.5% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Subscriber Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Subscriber Growth</CardTitle>
            <CardDescription>Paid subscribers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={SUBSCRIBER_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
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
                <Area
                  type="monotone"
                  dataKey="subscribers"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                +92.5% from last period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
            <CardDescription>Audience age demographics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={AGE_BREAKDOWN}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="age"
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
                <Bar
                  dataKey="count"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Audience gender demographics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={GENDER_BREAKDOWN}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ gender, value }) => `${gender}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {GENDER_BREAKDOWN.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={GENDER_COLORS[index % GENDER_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {GENDER_BREAKDOWN.map((item, index) => (
                <div key={item.gender} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: GENDER_COLORS[index] }}
                    />
                    <span className="text-sm">{item.gender}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {item.count.toLocaleString()} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Locations */}
      <Card>
        <CardHeader>
          <CardTitle>Top Locations</CardTitle>
          <CardDescription>Where your audience is from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TOP_LOCATIONS.map((location) => (
              <div key={location.country} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{location.flag}</span>
                    <div>
                      <p className="font-medium">{location.country}</p>
                      <p className="text-sm text-muted-foreground">
                        {location.count.toLocaleString()} users
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">{location.percentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${location.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Fans */}
      <Card>
        <CardHeader>
          <CardTitle>Top Fans</CardTitle>
          <CardDescription>Your most engaged followers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TOP_FANS.map((fan, index) => (
              <div
                key={fan.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={fan.avatar} />
                      <AvatarFallback>{fan.name[0]}</AvatarFallback>
                    </Avatar>
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {index + 1}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">{fan.name}</p>
                    <p className="text-sm text-muted-foreground">{fan.username}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{fan.engagement}%</p>
                  <p className="text-sm text-muted-foreground">
                    {fan.interactions} interactions
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Device & Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>How your audience accesses content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {DEVICE_BREAKDOWN.map((device) => {
              const Icon = device.icon
              return (
                <div key={device.device} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${device.color}20` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: device.color }} />
                      </div>
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <span className="font-semibold">{device.percentage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${device.percentage}%`,
                        backgroundColor: device.color,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Browser Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Browser Breakdown</CardTitle>
            <CardDescription>Browsers used by your audience</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={BROWSER_BREAKDOWN} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" tick={{ fill: 'currentColor' }} />
                <YAxis
                  type="category"
                  dataKey="browser"
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar
                  dataKey="percentage"
                  fill="#6366f1"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
