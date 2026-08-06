import type { Category } from '@snitch/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface FeaturedCategoriesProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  isLoading?: boolean;
}

export function FeaturedCategories({
  categories,
  selectedCategoryId,
  onSelectCategory,
  isLoading = false,
}: FeaturedCategoriesProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} className="h-7 w-24 rounded-full shrink-0 bg-white/10" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 select-none">
      {/* "All" Category Pill */}
      <button
        type="button"
        onClick={() => onSelectCategory(null)}
        className={cn(
          'group relative flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full shrink-0 transition-all duration-300 border focus:outline-none focus:ring-1 focus:ring-amber-400/50',
          selectedCategoryId === null
            ? 'bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-amber-500/20 text-white border-amber-400/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
            : 'bg-white/5 text-zinc-300 border-white/10 hover:border-white/30 hover:bg-white/10 hover:text-white',
        )}
      >
        <Sparkles
          className={cn(
            'w-3 h-3 transition-transform duration-300',
            selectedCategoryId === null
              ? 'text-amber-400 scale-110'
              : 'text-zinc-400 group-hover:scale-110',
          )}
        />
        <span>All</span>
      </button>

      {/* Category List */}
      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat._id || selectedCategoryId === cat.id;
        const imageUrl = cat.image?.url || cat.image?.path;

        return (
          <button
            key={cat._id || cat.id}
            type="button"
            onClick={() => onSelectCategory(cat._id || cat.id)}
            className={cn(
              'group relative flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full shrink-0 transition-all duration-300 border focus:outline-none focus:ring-1 focus:ring-amber-400/50',
              isSelected
                ? 'bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-amber-500/20 text-white border-amber-400/60 shadow-[0_0_10px_rgba(245,158,11,0.2)] scale-[1.02]'
                : 'bg-white/5 text-zinc-300 border-white/10 hover:border-white/30 hover:bg-white/10 hover:text-white',
            )}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={cat.name}
                className="w-4 h-4 rounded-full object-cover border border-white/20 group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-500/30 to-purple-600/30 border border-white/20 flex items-center justify-center text-[9px] uppercase font-bold text-amber-300">
                {cat.name.charAt(0)}
              </span>
            )}
            <span className="capitalize text-xs">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
