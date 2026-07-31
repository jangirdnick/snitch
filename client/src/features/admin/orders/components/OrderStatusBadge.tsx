import { cn } from '@/lib/utils';
import type { OrderQueryDto } from '@snitch/schemas';

interface OrderStatusBadgeProps {
  status: OrderQueryDto['status'];
  className?: string;
}

const getStatusConfig = (status: OrderQueryDto['status']) => {
  switch (status) {
    case 'new':
      return {
        bg: 'bg-[oklch(0.60_0.15_260_/_0.10)]',
        text: 'text-[oklch(0.75_0.15_260)]',
        border: 'border-[oklch(0.60_0.15_260_/_0.25)]',
        dot: 'bg-[oklch(0.60_0.15_260)]',
        shadow: 'shadow-[0_0_6px_oklch(0.60_0.15_260_/_0.7)]',
      };
    case 'processing':
      return {
        bg: 'bg-[oklch(0.75_0.18_70_/_0.10)]',
        text: 'text-[oklch(0.85_0.18_70)]',
        border: 'border-[oklch(0.75_0.18_70_/_0.25)]',
        dot: 'bg-[oklch(0.75_0.18_70)]',
        shadow: 'shadow-[0_0_6px_oklch(0.75_0.18_70_/_0.7)]',
      };
    case 'shipped':
      return {
        bg: 'bg-[oklch(0.65_0.20_250_/_0.10)]',
        text: 'text-[oklch(0.80_0.20_250)]',
        border: 'border-[oklch(0.65_0.20_250_/_0.25)]',
        dot: 'bg-[oklch(0.65_0.20_250)]',
        shadow: 'shadow-[0_0_6px_oklch(0.65_0.20_250_/_0.7)]',
      };
    case 'delivered':
      return {
        bg: 'bg-[oklch(0.70_0.15_160_/_0.10)]',
        text: 'text-[oklch(0.82_0.15_160)]',
        border: 'border-[oklch(0.70_0.15_160_/_0.25)]',
        dot: 'bg-[oklch(0.70_0.15_160)]',
        shadow: 'shadow-[0_0_6px_oklch(0.70_0.15_160_/_0.7)]',
      };
    case 'cancelled':
      return {
        bg: 'bg-[oklch(0.55_0.20_20_/_0.10)]',
        text: 'text-[oklch(0.75_0.20_20)]',
        border: 'border-[oklch(0.55_0.20_20_/_0.25)]',
        dot: 'bg-[oklch(0.55_0.20_20)]',
        shadow: 'shadow-[0_0_6px_oklch(0.55_0.20_20_/_0.7)]',
      };
    case 'returned':
      return {
        bg: 'bg-[oklch(0.60_0.15_40_/_0.10)]',
        text: 'text-[oklch(0.80_0.15_40)]',
        border: 'border-[oklch(0.60_0.15_40_/_0.25)]',
        dot: 'bg-[oklch(0.60_0.15_40)]',
        shadow: 'shadow-[0_0_6px_oklch(0.60_0.15_40_/_0.7)]',
      };
    default:
      return null;
  }
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  if (!status) return null;

  const config = getStatusConfig(status);

  if (!config) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10.5px] font-bold uppercase tracking-widest whitespace-nowrap',
        config.bg,
        config.text,
        config.border,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full shrink-0', config.dot, config.shadow)} />
      {status}
    </span>
  );
}
