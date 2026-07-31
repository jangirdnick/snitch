import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';

interface CategoryHeaderProps {
  onCreateClick: () => void;
}

export function CategoryHeader({ onCreateClick }: CategoryHeaderProps) {
  return (
    <PageHeader title="Categories" description="Manage product categories and classifications.">
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
          <span className="hidden sm:inline">Create Category</span>
          <span className="sm:hidden">Create</span>
        </span>
      </Button>
    </PageHeader>
  );
}
