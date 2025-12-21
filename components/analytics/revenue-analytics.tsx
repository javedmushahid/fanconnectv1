"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Gift,
  Eye,
  ArrowUpRight,
  Download,
} from "lucide-react";

// Mock Data
const REVENUE_BY_SOURCE = [
  { source: "Subscriptions", value: 15600, percentage: 65, color: "#3b82f6" },
  { source: "Tips", value: 4800, percentage: 20, color: "#10b981" },
  { source: "Pay-per-view", value: 2400, percentage: 10, color: "#f59e0b" },
  { source: "Other", value: 1200, percentage: 5, color: "#8b5cf6" },
];

const REVENUE_BY_TIER = [
  { tier: "Basic ($9.99)", subscribers: 850, revenue: 8491.5, percentage: 35 },
  {
    tier: "Premium ($19.99)",
    subscribers: 520,
    revenue: 10394.8,
    percentage: 43,
  },
  { tier: "VIP ($49.99)", subscribers: 140, revenue: 6998.6, percentage: 22 },
];

const TOP_PAYING_SUBSCRIBERS = [
  {
    id: "1",
    name: "Robert Johnson",
    username: "@robertj",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    tier: "VIP",
    monthlySpend: 149.99,
    lifetime: 1799.88,
    memberSince: "Jan 2024",
  },
  {
    id: "2",
    name: "Jennifer Smith",
    username: "@jennifers",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
    tier: "VIP",
    monthlySpend: 149.99,
    lifetime: 1649.89,
    memberSince: "Feb 2024",
  },
  {
    id: "3",
    name: "Michael Brown",
    username: "@michaelb",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    tier: "Premium",
    monthlySpend: 79.99,
    lifetime: 879.89,
    memberSince: "Mar 2024",
  },
  {
    id: "4",
    name: "Emily Davis",
    username: "@emilyd",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    tier: "Premium",
    monthlySpend: 79.99,
    lifetime: 799.9,
    memberSince: "Apr 2024",
  },
  {
    id: "5",
    name: "David Wilson",
    username: "@davidw",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    tier: "Premium",
    monthlySpend: 79.99,
    lifetime: 719.91,
    memberSince: "May 2024",
  },
];

const REVENUE_FORECAST = [
  { month: "Jan", actual: 18200, forecast: 18000 },
  { month: "Feb", actual: 19800, forecast: 19500 },
  { month: "Mar", actual: 21500, forecast: 21000 },
  { month: "Apr", actual: 22800, forecast: 22500 },
  { month: "May", actual: 23400, forecast: 23000 },
  { month: "Jun", actual: 24000, forecast: 24500 },
  { month: "Jul", actual: null, forecast: 26000 },
  { month: "Aug", actual: null, forecast: 27500 },
  { month: "Sep", actual: null, forecast: 29000 },
];

const CHURN_DATA = [
  { month: "Dec 14", rate: 4.2, lost: 12, new: 45 },
  { month: "Dec 15", rate: 3.8, lost: 11, new: 52 },
  { month: "Dec 16", rate: 3.5, lost: 10, new: 58 },
  { month: "Dec 17", rate: 3.2, lost: 9, new: 62 },
  { month: "Dec 18", rate: 2.9, lost: 8, new: 68 },
  { month: "Dec 19", rate: 2.7, lost: 7, new: 72 },
  { month: "Dec 20", rate: 2.5, lost: 7, new: 76 },
];

const METRICS = [
  {
    title: "Total Revenue",
    value: "$24,000",
    change: "+18.2%",
    trend: "up" as const,
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  {
    title: "Avg Revenue Per User",
    value: "$15.89",
    change: "+5.3%",
    trend: "up" as const,
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    title: "Active Subscribers",
    value: "1,510",
    change: "+12.1%",
    trend: "up" as const,
    icon: CreditCard,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
  },
  {
    title: "Churn Rate",
    value: "2.5%",
    change: "-0.7%",
    trend: "down" as const,
    icon: TrendingDown,
    color: "text-pink-600",
    bgColor: "bg-pink-100 dark:bg-pink-900/20",
  },
];

export default function RevenueAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Revenue Analytics</h1>
          <p className="text-muted-foreground">
            Track your earnings and monetization performance
          </p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <Badge
                    variant={metric.trend === "up" ? "default" : "secondary"}
                    className="gap-1"
                  >
                    {metric.trend === "up" ? (
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
          );
        })}
      </div>

      {/* Revenue by Source & Tier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Source */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Source</CardTitle>
            <CardDescription>Breakdown of income streams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={REVENUE_BY_SOURCE}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {REVENUE_BY_SOURCE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      value != null ? `$${value.toLocaleString()}` : "$0"
                    }
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {REVENUE_BY_SOURCE.map((source) => (
                <div key={source.source} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: source.color }}
                      />
                      <span>{source.source}</span>
                    </div>
                    <span className="font-semibold">
                      ${source.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${source.percentage}%`,
                        backgroundColor: source.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Tier */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Tier</CardTitle>
            <CardDescription>Income from subscription tiers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={REVENUE_BY_TIER}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="tier"
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
                <Tooltip
                  formatter={(value) =>
                    value != null ? `$${value.toLocaleString()}` : "$0"
                  }
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-3">
              {REVENUE_BY_TIER.map((tier) => (
                <div
                  key={tier.tier}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{tier.tier}</p>
                    <p className="text-xs text-muted-foreground">
                      {tier.subscribers} subscribers
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${tier.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tier.percentage}% of revenue
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Paying Subscribers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Paying Subscribers</CardTitle>
          <CardDescription>Your most valuable supporters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Subscriber</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Monthly</TableHead>
                  <TableHead>Lifetime Value</TableHead>
                  <TableHead>Member Since</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOP_PAYING_SUBSCRIBERS.map((subscriber, index) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={subscriber.avatar} />
                            <AvatarFallback>
                              {subscriber.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {index + 1}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium">{subscriber.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {subscriber.username}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          subscriber.tier === "VIP" ? "default" : "secondary"
                        }
                      >
                        {subscriber.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${subscriber.monthlySpend}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          ${subscriber.lifetime.toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {subscriber.memberSince}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Forecast & Churn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Forecast</CardTitle>
            <CardDescription>
              Projected revenue based on current trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={REVENUE_FORECAST}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
                <Tooltip
                  formatter={(value) =>
                    value != null ? `$${value.toLocaleString()}` : "$0"
                  }
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981" }}
                  name="Actual Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#6366f1"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#6366f1" }}
                  name="Forecast"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-900 dark:text-green-100">
                  <strong>Projected growth:</strong> $29,000/month by September
                  (+20.8%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Churn Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Churn Analysis</CardTitle>
            <CardDescription>
              Subscriber retention and churn trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={CHURN_DATA}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444" }}
                  name="Churn Rate %"
                />
                <Line
                  type="monotone"
                  dataKey="new"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981" }}
                  name="New Subscribers"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Lost this week
                </p>
                <p className="text-xl font-bold text-red-600">7</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Gained this week
                </p>
                <p className="text-xl font-bold text-green-600">76</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
