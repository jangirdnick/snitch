import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import type { Product } from '@snitch/types';

export default function ProductInfo({ product }: { product: Product }) {
  const { title, sku, price, review, shortDescription, status } = product;

  // calculate discount percentage
  const discountPercent =
    price.compareAtAmount && price.compareAtAmount > price.amount
      ? Math.round(((price.compareAtAmount - price.amount) / price.compareAtAmount) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Brand / Category (assuming first category name or brand if exists) */}
      <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Snitch</p>

      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        {review && review.count > 0 && (
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium text-foreground">{review.average}</span>
            <span className="text-muted-foreground">({review.count} reviews)</span>
          </div>
        )}
        <span className="text-muted-foreground">SKU: {sku}</span>
        {status === 'out_of_stock' && <Badge variant="destructive">Out of Stock</Badge>}
      </div>

      <div className="flex items-end gap-3 mt-2">
        <span className="text-3xl font-bold">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: price.currency }).format(
            price.amount,
          )}
        </span>
        {price.compareAtAmount && price.compareAtAmount > price.amount && (
          <span className="text-lg text-muted-foreground line-through mb-1">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: price.currency }).format(
              price.compareAtAmount,
            )}
          </span>
        )}
        {discountPercent > 0 && (
          <Badge
            variant="secondary"
            className="mb-1 bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
          >
            {discountPercent}% OFF
          </Badge>
        )}
      </div>

      {shortDescription && (
        <p className="text-muted-foreground text-sm leading-relaxed mt-2">{shortDescription}</p>
      )}
    </div>
  );
}
