import { useState } from 'react';
import type { Product } from '@snitch/types';
import { Heart, Eye, Star } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(() => {
    const defaultIdx = product.colors?.findIndex((c) => c.isDefault);
    return defaultIdx !== undefined && defaultIdx >= 0 ? defaultIdx : 0;
  });

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Selected color variant
  const activeColor = product.colors?.[selectedColorIndex] ?? product.colors?.[0];

  // Primary & secondary images for hover flip effect
  const primaryImg =
    activeColor?.images?.find((i) => i.isPrimary)?.url ||
    activeColor?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80';

  const secondaryImg =
    activeColor?.images?.[1]?.url ||
    product.colors?.[(selectedColorIndex + 1) % (product.colors.length || 1)]?.images?.[0]?.url ||
    primaryImg;

  // Calculate pricing & discount
  const currentPrice = product.price?.amount ?? 0;
  const comparePrice = product.price?.compareAtAmount;
  let discountPercent: number | null = null;

  if (comparePrice && comparePrice > currentPrice) {
    discountPercent = Math.round(((comparePrice - currentPrice) / comparePrice) * 100);
  } else if (product.price?.discount?.type === 'percentage') {
    discountPercent = product.price.discount.value;
  }

  // Calculate stock status
  const totalStock =
    product.totalStock ??
    product.colors?.reduce(
      (sum, c) => sum + (c.sizes?.reduce((sSum, s) => sSum + (s.stock ?? 0), 0) ?? 0),
      0,
    ) ??
    0;

  const isOutOfStock = product.status === 'out_of_stock' || totalStock <= 0;
  const isLowStock = !isOutOfStock && totalStock <= (product.lowStockThreshold ?? 5);

  // Category name formatter
  const categoryName = Array.isArray(product.category)
    ? typeof product.category[0] === 'object' && product.category[0] !== null
      ? (product.category[0] as { name?: string }).name || 'Fashion'
      : 'Fashion'
    : typeof product.category === 'string'
      ? product.category
      : 'Fashion';

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isWishlisted) {
      setIsWishlisted(true);
      showToast.success('Added to Wishlist', {
        description: `${product.title} saved to favorites.`,
      });
    } else {
      setIsWishlisted(false);
      showToast.info('Removed from Wishlist', {
        description: `${product.title} removed from favorites.`,
      });
    }
  };

  return (
    <div
      className="group relative flex flex-col w-full h-full rounded-xl bg-zinc-900/80 backdrop-blur-md border border-white/10 hover:border-amber-400/50 transition-all duration-300 overflow-hidden shadow-md hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Image Container (Flexible Height) ───────────────────────────────── */}
      <div className="relative w-full flex-1 min-h-0 overflow-hidden bg-zinc-950/80">
        {/* Primary Image */}
        <img
          src={primaryImg}
          alt={product.title}
          className={cn(
            'absolute inset-0 w-full h-full object-cover object-top transition-all duration-500 ease-out group-hover:scale-105',
            isHovered && secondaryImg !== primaryImg ? 'opacity-0 scale-105' : 'opacity-100',
          )}
          loading="lazy"
        />

        {/* Secondary Image (Hover Flip) */}
        {secondaryImg !== primaryImg && (
          <img
            src={secondaryImg}
            alt={`${product.title} alternate view`}
            className={cn(
              'absolute inset-0 w-full h-full object-cover object-top transition-all duration-500 ease-out',
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100',
            )}
            loading="lazy"
          />
        )}

        {/* Top Badges Overlay */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            {/* Discount Badge */}
            {discountPercent && discountPercent > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase rounded bg-amber-500 text-black backdrop-blur-md shadow">
                -{discountPercent}%
              </span>
            )}

            {/* Stock Badge */}
            {isOutOfStock ? (
              <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-zinc-900/90 text-zinc-400 border border-zinc-700/50 backdrop-blur-md">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                Low ({totalStock})
              </span>
            ) : null}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={cn(
              'pointer-events-auto p-1.5 rounded-full backdrop-blur-md transition-all duration-300 shadow focus:outline-none',
              isWishlisted
                ? 'bg-amber-400 text-black scale-110 shadow-amber-400/40'
                : 'bg-zinc-900/70 text-zinc-300 hover:text-amber-400 hover:bg-zinc-900/90 hover:scale-110',
            )}
          >
            <Heart
              className={cn(
                'w-3.5 h-3.5 transition-transform',
                isWishlisted && 'fill-current scale-110',
              )}
            />
          </button>
        </div>

        {/* Quick View Hover Button */}
        {onQuickView && (
          <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-250">
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] font-medium text-white bg-zinc-950/85 hover:bg-amber-500 hover:text-black border border-white/20 rounded-lg backdrop-blur-md transition-all duration-300 shadow"
            >
              <Eye className="w-3 h-3" />
              <span>Quick View</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Content Container (Fixed / Compact Height) ──────────────────────── */}
      <div className="flex flex-col p-2.5 gap-1 shrink-0 bg-zinc-900/90 border-t border-white/5">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between text-[10px] text-zinc-400">
          <span className="uppercase tracking-wider font-semibold text-amber-400/90 truncate max-w-[65%]">
            {categoryName}
          </span>

          <div className="flex items-center gap-0.5 text-amber-400 font-medium text-[10px]">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span>4.9</span>
          </div>
        </div>

        {/* Product Title */}
        <h3
          className="text-xs font-semibold text-zinc-100 line-clamp-1 group-hover:text-amber-300 transition-colors duration-200"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Color Swatches & Price Row */}
        <div className="flex items-center justify-between pt-0.5 mt-auto">
          {/* Swatches */}
          {product.colors && product.colors.length > 0 ? (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 4).map((color, idx) => (
                <button
                  key={color.hex + idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColorIndex(idx);
                  }}
                  onMouseEnter={() => setSelectedColorIndex(idx)}
                  aria-label={`Select color ${color.name}`}
                  title={color.name}
                  className={cn(
                    'w-2.5 h-2.5 rounded-full border transition-all duration-200 focus:outline-none',
                    selectedColorIndex === idx
                      ? 'ring-1 ring-amber-400 ring-offset-1 ring-offset-zinc-900 scale-125 border-white'
                      : 'border-white/30 opacity-70 hover:opacity-100',
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[9px] text-zinc-500 font-medium">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          ) : (
            <div />
          )}

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 ml-auto">
            <span className="text-xs font-bold text-white tracking-tight">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {comparePrice && comparePrice > currentPrice && (
              <span className="text-[10px] text-zinc-500 line-through">
                ₹{comparePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
