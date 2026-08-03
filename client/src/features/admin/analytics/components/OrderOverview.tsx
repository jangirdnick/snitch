import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { OrderOverviewData } from '@snitch/types';

interface OrderOverviewProps {
  data: OrderOverviewData[];
}

const STATUS_COLORS: Record<string, string> = {
  delivered: 'oklch(0.65 0.15 150)', // Green
  processing: 'oklch(0.7 0.15 250)', // Blue
  shipped: 'oklch(0.75 0.15 200)', // Teal
  new: 'oklch(0.8 0.15 80)', // Orange
  cancelled: 'oklch(0.6 0.2 25)', // Red
  returned: 'oklch(0.5 0.1 300)', // Purple
};

export function OrderOverview({ data }: OrderOverviewProps) {
  // Filter out statuses with 0 count to make chart cleaner
  const chartData = data.filter((d) => d.count > 0);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Order Distribution</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Status breakdown for the last 3 months
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="h-[280px] sm:h-[350px] w-full flex items-center justify-center">
          {chartData.length === 0 ? (
            <div className="text-sm text-muted-foreground flex items-center justify-center h-full">
              No orders found in the last 3 months
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="45%"
                  innerRadius="50%"
                  outerRadius="75%"
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="status"
                  stroke="var(--color-background)"
                  strokeWidth={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.status.toLowerCase()] || 'var(--color-muted)'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                    fontSize: '12px',
                  }}
                  formatter={(value, name) => [
                    value ?? 0,
                    typeof name === 'string'
                      ? name.charAt(0).toUpperCase() + name.slice(1)
                      : String(name ?? ''),
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-xs sm:text-sm font-medium text-foreground capitalize ml-1">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
