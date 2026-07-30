import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';

interface InventoryHeaderProps {
  onCreateClick: () => void;
  onCreateCategoryClick?: () => void;
}

export function InventoryHeader({ onCreateClick, onCreateCategoryClick }: InventoryHeaderProps) {
  return (
    <PageHeader
      title="Product Inventory"
      description="Manage your products, stock levels, and listings."
    >
      {onCreateCategoryClick && (
        <Button
          size="sm"
          variant="outline"
          onClick={onCreateCategoryClick}
          className={cn(
            'group relative shrink-0 overflow-hidden rounded-xl h-10 px-3.5 sm:px-4',
            'bg-[oklch(1_0_0_/_0.03)] border-[oklch(1_0_0_/_0.1)] text-[oklch(0.85_0_0)]',
            'hover:bg-[oklch(1_0_0_/_0.08)] hover:text-[oklch(0.95_0_0)]',
            'font-medium text-[12px] sm:text-[12.5px] tracking-wide',
            'transition-all duration-300 ease-in-out active:scale-[0.98]',
          )}
        >
          <span className="flex items-center justify-center gap-1.5">
            <Plus
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
            <span className="hidden sm:inline">New Category</span>
            <span className="sm:hidden">Category</span>
          </span>
        </Button>
      )}

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
          <span className="sm:hidden">Product</span>
        </span>
      </Button>
    </PageHeader>
  );
}
