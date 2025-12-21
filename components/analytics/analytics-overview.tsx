'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  DollarSign,
  Heart,
  Calendar as CalendarIcon,
  Download,
} from 'lucide-react'
import { format, subDays } from 'date-fns'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

// Mock data
const VIEWS_DATA = [
  { date: 'Dec 14', views: 2400, previousPeriod: 2100 },
  { date: 'Dec 15', views: 1398, previousPeriod: 1800 },
  { date: 'Dec 16', views: 9800, previousPeriod: 8200 },
  { date: 'Dec 17', views: 3908, previousPeriod: 3200 },
  { date: 'Dec 18', views: 4800, previousPeriod: 4100 },
  { date: 'Dec 19', views: 3800, previousPeriod: 3400 },
  { date: 'Dec 20', views: 4300, previousPeriod: 3900 },
]

const SUBSCRIBERS_DATA = [
  { date: 'Dec 14', subscribers: 120, previousPeriod: 100 },
  { date: 'Dec 15', subscribers: 150, previousPeriod: 130 },
  { date: 'Dec 16', subscribers: 280, previousPeriod: 220 },
  { date: 'Dec 17', subscribers: 340, previousPeriod: 280 },
  { date: 'Dec 18', subscribers: 420, previousPeriod: 360 },
  { date: 'Dec 19', subscribers: 480, previousPeriod: 410 },
  { date: 'Dec 20', subscribers: 520, previousPeriod: 450 },
]

const REVENUE_DATA = [
  { date: 'Dec 14', revenue: 1200, previousPeriod: 1000 },
  { date: 'Dec 15', revenue: 1800, previousPeriod: 1500 },
  { date: 'Dec 16', revenue: 2400, previousPeriod: 2000 },
  { date: 'Dec 17', revenue: 2100, previousPeriod: 1800 },
  { date: 'Dec 18', revenue: 2800, previousPeriod: 2400 },
  { date: 'Dec 19', revenue: 3200, previousPeriod: 2800 },
  { date: 'Dec 20', revenue: 3600, previousPeriod: 3100 },
]

const ENGAGEMENT_DATA = [
  { date: 'Dec 14', rate: 4.2, previousPeriod: 3.8 },
  { date: 'Dec 15', rate: 4.5, previousPeriod: 4.0 },
  { date: 'Dec 16', rate: 5.1, previousPeriod: 4.6 },
  { date: 'Dec 17', rate: 4.8, previousPeriod: 4.4 },
  { date: 'Dec 18', rate: 5.3, previousPeriod: 4.8 },
  { date: 'Dec 19', rate: 5.6, previousPeriod: 5.1 },
  { date: 'Dec 20', rate: 5.9, previousPeriod: 5.4 },
]

export default function AnalyticsOverview() {
  const [dateRange, setDateRange] = useState('7')
  const [comparePeriod, setComparePeriod] = useState(true)
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  const metrics = [
    {
      title: 'Total Views',
      value: '28.4K',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'New Subscribers',
      value: '520',
      change: '+15.3%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Revenue',
      value: '$3,600',
      change: '+16.1%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Engagement Rate',
      value: '5.9%',
      change: '+9.3%',
      trend: 'up' as const,
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100 dark:bg-pink-900/20',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Overview</h1>
          <p className="text-muted-foreground">
            Track your performance and growth metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Date Range Selector */}
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>

            {/* Custom Date Range */}
            {dateRange === 'custom' && (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full md:w-[200px] justify-start text-left font-normal',
                        !dateFrom && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, 'PPP') : 'From date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full md:w-[200px] justify-start text-left font-normal',
                        !dateTo && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, 'PPP') : 'To date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </>
            )}

            {/* Compare Period Toggle */}
            <Button
              variant={comparePeriod ? 'default' : 'outline'}
              onClick={() => setComparePeriod(!comparePeriod)}
              className="w-full md:w-auto"
            >
              {comparePeriod ? 'Comparing Periods' : 'Compare Periods'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('p-2 rounded-lg', metric.bgColor)}>
                    <Icon className={cn('h-5 w-5', metric.color)} />
                  </div>
                  <Badge
                    variant={metric.trend === 'up' ? 'default' : 'destructive'}
                    className="gap-1"
                  >
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {metric.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
            <CardDescription>Daily views for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={VIEWS_DATA}>
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
                {comparePeriod && (
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                )}
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                  name="Current Period"
                />
                {comparePeriod && (
                  <Line
                    type="monotone"
                    dataKey="previousPeriod"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: 'hsl(var(--muted-foreground))' }}
                    name="Previous Period"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscribers Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Subscribers Over Time</CardTitle>
            <CardDescription>
              Cumulative subscriber growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={SUBSCRIBERS_DATA}>
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
                {comparePeriod && (
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                )}
                <Area
                  type="monotone"
                  dataKey="subscribers"
                  stroke="hsl(142 76% 36%)"
                  fill="hsl(142 76% 36% / 0.2)"
                  strokeWidth={2}
                  name="Current Period"
                />
                {comparePeriod && (
                  <Area
                    type="monotone"
                    dataKey="previousPeriod"
                    stroke="hsl(var(--muted-foreground))"
                    fill="hsl(var(--muted-foreground) / 0.1)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Previous Period"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Daily revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={REVENUE_DATA}>
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
                {comparePeriod && (
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                )}
                <Bar
                  dataKey="revenue"
                  fill="hsl(262 83% 58%)"
                  radius={[4, 4, 0, 0]}
                  name="Current Period"
                />
                {comparePeriod && (
                  <Bar
                    dataKey="previousPeriod"
                    fill="hsl(var(--muted-foreground) / 0.3)"
                    radius={[4, 4, 0, 0]}
                    name="Previous Period"
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Rate</CardTitle>
            <CardDescription>
              Average engagement rate over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ENGAGEMENT_DATA}>
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
                {comparePeriod && (
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                )}
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(336 84% 61%)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(336 84% 61%)' }}
                  name="Current Period"
                />
                {comparePeriod && (
                  <Line
                    type="monotone"
                    dataKey="previousPeriod"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: 'hsl(var(--muted-foreground))' }}
                    name="Previous Period"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
