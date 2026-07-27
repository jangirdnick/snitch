import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InventoryHeaderProps {
  onCreateClick: () => void;
}

export function InventoryHeader({ onCreateClick }: InventoryHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 shrink-0 px-4 md:px-6 mx-0 lg:-mx-6 lg:px-6 max-md:py-3',
        'border-b border-[oklch(1_0_0_/0.05)]',
        'bg-[oklch(0.08_0.005_260_/0.88)] backdrop-blur-2xl',
        'flex items-center justify-between gap-3 md:gap-4',
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="text-lg sm:text-[20px] font-semibold text-[oklch(0.97_0_0)] tracking-tight leading-tight">
          Product Inventory
        </h1>
        <p className="text-[11px] sm:text-[12px] text-[oklch(0.42_0_0)] mt-0.5 sm:mt-1 font-light truncate">
          Manage your products, stock levels, and listings.
        </p>
      </div>

      <Button
        size="sm"
        onClick={onCreateClick}
        className={cn(
          'group relative shrink-0 overflow-hidden rounded-xl h-10 px-3.5 sm:px-4',
          'bg-orange-800 text-[oklch(0.98_0_0)] hover:bg-orange-700',
          'font-semibold text-[12px] sm:text-[12.5px] tracking-wide',
          'shadow-[0_2px_12px_oklch(1_0_0_/0.12)] hover:shadow-[0_6px_20px_oklch(1_0_0_/0.22)]',
          'transition-all duration-300 ease-in-out active:scale-[0.98]',
          'focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        )}
      >
        <span className="flex items-center justify-center gap-1.5">
          <Plus
            size={16}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
          <span className="hidden sm:inline">Create Product</span>
          <span className="sm:hidden">Create</span>
        </span>
      </Button>
    </header>
  );
}
