import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { KpiMetric } from '@snitch/types';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  metric: KpiMetric;
  icon: LucideIcon;
  formatValue?: (val: number) => string | number;
  index?: number;
}

export function KpiCard({ title, metric, icon: Icon, formatValue, index = 1 }: KpiCardProps) {
  const isUp = metric.trend === 'up';
  const isDown = metric.trend === 'down';

  const variants = [
    // index 0 - Total Sales (Primary Brand)
    {
      card: 'bg-orange-500/50 text-white border-transparent shadow-[0_8px_20px_-6px_var(--color-orange-800)]',
      icon: 'text-white/80',
      title: 'text-white/90',
      value: 'text-white',
      trendUp: 'text-white/90',
      trendDown: 'text-white/90',
      trendNeutral: 'text-white/70',
      trendText: 'text-white/70',
    },
    // index 1 - Products Sold (Subtle Brand Tint)
    {
      card: 'bg-card shadow-sm border-red-100 dark:border-red-900/30',
      icon: 'text-red-500/80',
      title: 'text-muted-foreground',
      value: 'text-foreground',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
      trendNeutral: 'text-muted-foreground',
      trendText: 'text-muted-foreground',
    },
    // index 2 - Today's Orders (Standard with blue tint icon)
    {
      card: 'bg-card shadow-sm',
      icon: 'text-blue-500',
      title: 'text-muted-foreground',
      value: 'text-foreground',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
      trendNeutral: 'text-muted-foreground',
      trendText: 'text-muted-foreground',
    },
    // index 3 - Cancelled Orders (Standard with red tint icon)
    {
      card: 'bg-card shadow-sm border-red-100 dark:border-red-900/30',
      icon: 'text-red-500/80',
      title: 'text-muted-foreground',
      value: 'text-foreground',
      trendUp: 'text-green-600 dark:text-green-400',
      trendDown: 'text-red-600 dark:text-red-400',
      trendNeutral: 'text-muted-foreground',
      trendText: 'text-muted-foreground',
    },
  ];

  const style = variants[index % variants.length];

  return (
    <Card className={cn(style.card)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn('text-sm font-medium', style.title)}>{title}</CardTitle>
        <div
          className={cn(
            'p-2 rounded-full bg-background/5 dark:bg-foreground/5',
            index === 0 && 'bg-black/10 dark:bg-black/20',
          )}
        >
          <Icon className={cn('h-4 w-4', style.icon)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold tracking-tight', style.value)}>
          {formatValue ? formatValue(metric.value) : metric.value}
        </div>
        <p
          className={cn(
            'text-xs mt-1 font-medium',
            isUp ? style.trendUp : isDown ? style.trendDown : style.trendNeutral,
          )}
        >
          {metric.change > 0 ? '+' : ''}
          {metric.change}%
          <span className={cn('font-normal ml-1', style.trendText)}>from last month</span>
        </p>
      </CardContent>
    </Card>
  );
}
