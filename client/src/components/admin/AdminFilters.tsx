import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FilterOption {
  label: string;
  value: string;
  dotClass?: string;
}

export interface SortOption {
  label: string;
  value: string;
}

interface AdminFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  debouncedSearch: string;
  searchPlaceholder?: string;

  statusFilter: string;
  onStatusChange: (value: string) => void;
  statusOptions: FilterOption[];

  sortValue: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];

  onClearFilters: () => void;
}

const TOP_GLOW = (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[oklch(1_0_0_/_0.16)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
  />
);

export function AdminFilters({
  searchTerm,
  onSearchChange,
  debouncedSearch,
  searchPlaceholder = 'Search...',
  statusFilter,
  onStatusChange,
  statusOptions,
  sortValue,
  onSortChange,
  sortOptions,
  onClearFilters,
}: AdminFiltersProps) {
  return (
    <div
      className={cn(
        'group relative rounded-2xl',
        'bg-gradient-to-b from-[oklch(0.145_0.005_260)] to-[oklch(0.115_0.005_260)]',
        'border border-[oklch(1_0_0_/_0.055)] hover:border-[oklch(1_0_0_/_0.11)]',
        'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
        'shadow-[0_4px_24px_oklch(0_0_0_/_0.35)] hover:shadow-[0_8px_32px_oklch(0_0_0_/_0.5)]',
        'p-4 sm:p-5 mx-4 md:mx-6 lg:mx-0 shrink-0',
      )}
    >
      {TOP_GLOW}
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 relative z-10">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[oklch(0.55_0_0)]" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-10 bg-[oklch(1_0_0_/_0.03)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] placeholder:text-[oklch(0.42_0_0)] focus-visible:ring-[oklch(1_0_0_/_0.2)] focus-visible:border-[oklch(1_0_0_/_0.15)] h-11 rounded-xl"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 lg:flex lg:w-auto gap-2 lg:gap-4">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full lg:w-[180px] bg-[oklch(1_0_0_/_0.03)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] h-11 rounded-xl focus:ring-[oklch(1_0_0_/_0.2)] focus:border-[oklch(1_0_0_/_0.15)]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[oklch(0.13_0.005_260)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] rounded-xl shadow-[0_8px_32px_oklch(0_0_0_/_0.6)]">
              {statusOptions.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)]"
                >
                  {opt.dotClass ? (
                    <span className="flex items-center gap-2">
                      <span className={cn('w-2 h-2 rounded-full', opt.dotClass)} />
                      {opt.label}
                    </span>
                  ) : (
                    opt.label
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortValue} onValueChange={onSortChange}>
            <SelectTrigger className="w-full lg:w-[210px] bg-[oklch(1_0_0_/_0.03)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] h-11 rounded-xl focus:ring-[oklch(1_0_0_/_0.2)] focus:border-[oklch(1_0_0_/_0.15)]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-[oklch(0.13_0.005_260)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] rounded-xl shadow-[0_8px_32px_oklch(0_0_0_/_0.6)]">
              {sortOptions.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)]"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {(debouncedSearch || statusFilter !== 'all') && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[oklch(1_0_0_/_0.055)] relative z-10">
          <span className="text-xs text-[oklch(0.42_0_0)]">Filters:</span>
          {debouncedSearch && (
            <Badge
              variant="outline"
              className="text-[10.5px] border-[oklch(1_0_0_/_0.1)] bg-[oklch(1_0_0_/_0.03)] text-[oklch(0.7_0_0)] font-normal rounded-md"
            >
              Search: {debouncedSearch}
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge
              variant="outline"
              className="text-[10.5px] border-[oklch(1_0_0_/_0.1)] bg-[oklch(1_0_0_/_0.03)] text-[oklch(0.7_0_0)] font-normal rounded-md capitalize"
            >
              {statusOptions.find((o) => o.value === statusFilter)?.label ||
                statusFilter.replace('_', ' ')}
            </Badge>
          )}
          <button
            onClick={onClearFilters}
            className="text-[11px] text-[oklch(0.55_0_0)] hover:text-[oklch(0.95_0_0)] underline ml-auto transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
