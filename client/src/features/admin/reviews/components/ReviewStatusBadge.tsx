import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ReviewStatus = 'active' | 'blocked' | 'reported';

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const config = {
    active: {
      label: 'Active',
      className:
        'bg-[oklch(0.3_0.1_160)]/20 text-[oklch(0.70_0.15_160)] border-[oklch(0.70_0.15_160)]/30',
      dot: 'bg-[oklch(0.70_0.15_160)] shadow-[0_0_6px_oklch(0.70_0.15_160_/_0.7)]',
    },
    blocked: {
      label: 'Blocked',
      className:
        'bg-[oklch(0.3_0.15_22)]/20 text-[oklch(0.65_0.20_22)] border-[oklch(0.65_0.20_22)]/30',
      dot: 'bg-[oklch(0.65_0.20_22)] shadow-[0_0_6px_oklch(0.65_0.20_22_/_0.6)]',
    },
    reported: {
      label: 'Reported',
      className:
        'bg-[oklch(0.4_0.15_60)]/20 text-[oklch(0.7_0.2_60)] border-[oklch(0.7_0.2_60)]/30',
      dot: 'bg-[oklch(0.7_0.2_60)] shadow-[0_0_6px_oklch(0.7_0.2_60_/_0.6)]',
    },
  };

  const current = config[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium text-[11px] h-6 px-2.5 gap-1.5 transition-colors border shadow-sm',
        current.className,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', current.dot)} />
      {current.label}
    </Badge>
  );
}
