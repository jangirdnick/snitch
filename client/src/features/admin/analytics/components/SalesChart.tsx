import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { SalesAnalyticsData } from '@snitch/types';

interface SalesChartProps {
  data: SalesAnalyticsData[];
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Sales Overview</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Monthly revenue across the last 12 months
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 pb-4">
        <div className="h-[250px] sm:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border)"
                opacity={0.4}
              />
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={6}
              />
              <YAxis
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
                width={50}
              />
              <Tooltip
                cursor={{ fill: 'var(--color-muted)', opacity: 0.2 }}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  fontSize: '12px',
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
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
