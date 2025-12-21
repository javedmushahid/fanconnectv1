"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", subscribers: 45 },
  { month: "Feb", subscribers: 62 },
  { month: "Mar", subscribers: 78 },
  { month: "Apr", subscribers: 85 },
  { month: "May", subscribers: 102 },
  { month: "Jun", subscribers: 124 },
  { month: "Jul", subscribers: 118 },
  { month: "Aug", subscribers: 142 },
  { month: "Sep", subscribers: 156 },
  { month: "Oct", subscribers: 178 },
  { month: "Nov", subscribers: 198 },
  { month: "Dec", subscribers: 234 },
];

export default function SubscriberChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriber Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="subscribers"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: "#8b5cf6", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
