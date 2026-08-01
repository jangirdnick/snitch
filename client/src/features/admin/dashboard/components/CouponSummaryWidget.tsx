import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { CouponSummary } from '@snitch/types';
import { Ticket } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

interface Props {
  summary: CouponSummary;
}

export function CouponSummaryWidget({ summary }: Props) {
  const total = summary.active + summary.expired;
  const activePercent = total > 0 ? (summary.active / total) * 100 : 0;

  return (
    <Card className="col-span-1 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Ticket className="h-4 w-4 text-emerald-500" />
              Coupons
            </CardTitle>
            <CardDescription>Overall usage summary</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="h-8" asChild>
            <Link to="/admin/coupons">Manage</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-2 gap-4 text-center mb-6">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {summary.active}
            </div>
            <div className="text-xs text-muted-foreground font-medium mt-1 uppercase">Active</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-muted-foreground">{summary.expired}</div>
            <div className="text-xs text-muted-foreground font-medium mt-1 uppercase">Expired</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span>
              Total Used: <span className="text-foreground">{summary.totalUsed}</span> times
            </span>
            <span>{Math.round(activePercent)}% Active</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all"
              style={{ width: `${activePercent}%` }}
            />
            <div
              className="bg-muted-foreground/30 h-full transition-all"
              style={{ width: `${100 - activePercent}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
