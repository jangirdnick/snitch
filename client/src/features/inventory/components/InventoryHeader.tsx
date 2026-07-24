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
        'sticky top-0 z-40 shrink-0 px-4 md:px-6  mx-0 lg:-mx-6 lg:px-6 -mt-6 lg:-mt-6 mb-2',
        'border-b border-[oklch(1_0_0_/0.05)]',
        'bg-[oklch(0.08_0.005_260_/0.88)] backdrop-blur-2xl',
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4',
      )}
    >
      <div>
        <h1 className="text-[20px] font-semibold text-[oklch(0.97_0_0)] tracking-tight leading-none">
          Product Inventory
        </h1>
        <p className="text-[12px] text-[oklch(0.42_0_0)] mt-1.5 font-light">
          Manage your products, stock levels, and listings.
        </p>
      </div>
      <Button
        onClick={onCreateClick}
        className={cn(
          'group relative overflow-hidden rounded-xl',
          'bg-orange-700 text-[oklch(0.08_0_0)] hover:bg-orange-500',
          'font-semibold text-[12.5px] tracking-wide',
          'shadow-[0_2px_12px_oklch(1_0_0_/0.12)] hover:shadow-[0_6px_20px_oklch(1_0_0_/0.22)]',
          'transition-all duration-300 ease-in-out',
          'active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          'w-full sm:w-auto h-10 px-5',
        )}
      >
        <span className="flex items-center justify-center gap-2">
          <Plus
            size={16}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
          Create Product
        </span>
      </Button>
    </header>
  );
}
