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

interface InventoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  debouncedSearch: string;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
}

const TOP_GLOW = (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[oklch(1_0_0_/_0.16)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
  />
);

export function InventoryFilters({
  searchTerm,
  onSearchChange,
  debouncedSearch,
  statusFilter,
  onStatusChange,
  sortValue,
  onSortChange,
  onClearFilters,
}: InventoryFiltersProps) {
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
            placeholder="Search by name or SKU..."
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
              <SelectItem
                value="all"
                className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)]"
              >
                All Status
              </SelectItem>
              <SelectItem
                value="active"
                className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)]"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[oklch(0.70_0.15_160)] shadow-[0_0_6px_oklch(0.70_0.15_160_/_0.7)]" />
                  Active
                </span>
              </SelectItem>
              <SelectItem
                value="draft"
                className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)]"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[oklch(0.55_0_0)] shadow-[0_0_6px_oklch(0.55_0_0_/_0.6)]" />
                  Draft
                </span>
              </SelectItem>
              <SelectItem
                value="inactive"
                className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)]"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[oklch(0.42_0_0)] shadow-[0_0_6px_oklch(0.42_0_0_/_0.4)]" />
                  Inactive
                </span>
              </SelectItem>
              <SelectItem
                value="out_of_stock"
                className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)]"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[oklch(0.65_0.20_22)] shadow-[0_0_6px_oklch(0.65_0.20_22_/_0.6)]" />
                  Out of Stock
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortValue} onValueChange={onSortChange}>
            <SelectTrigger className="w-full lg:w-[210px] bg-[oklch(1_0_0_/_0.03)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] h-11 rounded-xl focus:ring-[oklch(1_0_0_/_0.2)] focus:border-[oklch(1_0_0_/_0.15)]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-[oklch(0.13_0.005_260)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] rounded-xl shadow-[0_8px_32px_oklch(0_0_0_/_0.6)]">
              <SelectItem
                value="createdAt-desc"
                className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)]"
              >
                Newest First
              </SelectItem>
              <SelectItem
                value="createdAt-asc"
                className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)]"
              >
                Oldest First
              </SelectItem>
              <SelectItem
                value="price-desc"
                className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)]"
              >
                Price: High to Low
              </SelectItem>
              <SelectItem
                value="price-asc"
                className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)]"
              >
                Price: Low to High
              </SelectItem>
              <SelectItem
                value="soldCount-desc"
                className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)]"
              >
                Best Selling
              </SelectItem>
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
              {statusFilter.replace('_', ' ')}
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
