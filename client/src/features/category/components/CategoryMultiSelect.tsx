import * as React from 'react';
import { useCategoryList } from '../hook/useCategoryList';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  id?: string;
  'aria-invalid'?: boolean;
}

export function CategoryMultiSelect({
  value = [],
  onChange,
  id,
  'aria-invalid': ariaInvalid,
}: CategoryMultiSelectProps) {
  const { categories, loading } = useCategoryList();

  const handleToggle = (categoryId: string, checked: boolean) => {
    if (checked) {
      onChange([...value, categoryId]);
    } else {
      onChange(value.filter((id) => id !== categoryId));
    }
  };

  const selectedCategories = categories.filter((c) => value.includes(c._id));

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            className={cn(
              'w-full justify-between h-auto min-h-[38px] px-3 py-1.5 font-normal',
              'bg-[oklch(1_0_0_/_0.03)] border-[oklch(1_0_0_/_0.10)] text-[oklch(0.85_0_0)]',
              'hover:bg-[oklch(1_0_0_/_0.05)]',
              ariaInvalid && 'border-[oklch(0.65_0.22_22)]',
            )}
          >
            {value.length === 0 ? (
              <span className="text-[oklch(0.45_0_0)]">Select categories...</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedCategories.length > 0 ? (
                  selectedCategories.map((c) => (
                    <Badge
                      key={c._id}
                      variant="secondary"
                      className="bg-[oklch(1_0_0_/_0.08)] hover:bg-[oklch(1_0_0_/_0.12)] text-[oklch(0.85_0_0)] rounded-md font-medium px-2 py-0.5 border-transparent"
                    >
                      {c.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-[oklch(0.85_0_0)]">{value.length} selected</span>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin text-[oklch(0.45_0_0)]" />}
              <ChevronDown size={14} className="opacity-50" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[300px] max-h-[300px] overflow-y-auto bg-[oklch(0.12_0.005_260)] border-[oklch(1_0_0_/_0.08)]"
        >
          <DropdownMenuLabel className="text-[oklch(0.65_0_0)]">
            Available Categories
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[oklch(1_0_0_/_0.05)]" />
          {categories.length === 0 && !loading ? (
            <div className="p-3 text-sm text-[oklch(0.45_0_0)] text-center">
              No categories found. Create one first.
            </div>
          ) : (
            categories.map((cat) => {
              const isChecked = value.includes(cat._id);
              return (
                <DropdownMenuCheckboxItem
                  key={cat._id}
                  checked={isChecked}
                  onCheckedChange={(checked) => handleToggle(cat._id, checked)}
                  className="text-[oklch(0.85_0_0)] focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)]"
                >
                  <span className="truncate">{cat.name}</span>
                </DropdownMenuCheckboxItem>
              );
            })
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
