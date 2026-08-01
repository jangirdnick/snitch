import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { SalesAnalyticsData } from '@snitch/types';

interface SalesChartProps {
  data: SalesAnalyticsData[];
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly revenue across the last 12 months</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border)"
                opacity={0.4}
              />
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
                width={60}
              />
              <Tooltip
                cursor={{ fill: 'var(--color-muted)', opacity: 0.2 }}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                }}
                formatter={(value) => [`₹${value ?? 0}`, 'Revenue']}
                labelStyle={{
                  color: 'var(--color-foreground)',
                  fontWeight: 600,
                  marginBottom: '4px',
                }}
              />
              <Bar
                dataKey="revenue"
                fill="var(--color-brand-500)"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
