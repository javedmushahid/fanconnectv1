'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', earnings: 1200, subscribers: 45 },
  { month: 'Feb', earnings: 1800, subscribers: 62 },
  { month: 'Mar', earnings: 2200, subscribers: 78 },
  { month: 'Apr', earnings: 1900, subscribers: 85 },
  { month: 'May', earnings: 2800, subscribers: 102 },
  { month: 'Jun', earnings: 3200, subscribers: 124 },
  { month: 'Jul', earnings: 2900, subscribers: 118 },
  { month: 'Aug', earnings: 3500, subscribers: 142 },
  { month: 'Sep', earnings: 3800, subscribers: 156 },
  { month: 'Oct', earnings: 4200, subscribers: 178 },
  { month: 'Nov', earnings: 4500, subscribers: 198 },
  { month: 'Dec', earnings: 5200, subscribers: 234 },
]

export default function EarningsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="earnings" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorEarnings)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
