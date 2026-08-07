import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingBag, Heart } from 'lucide-react';

interface AddToCartSectionProps {
  quantity: number;
  setQuantity: (q: number) => void;
  maxQuantity: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isAdding?: boolean;
  isOutOfStock?: boolean;
  disabled?: boolean;
}

export default function AddToCartSection({
  quantity,
  setQuantity,
  maxQuantity,
  onAddToCart,
  onBuyNow,
  isAdding,
  isOutOfStock,
  disabled,
}: AddToCartSectionProps) {
  const handleDecrement = () => setQuantity(Math.max(1, quantity - 1));
  const handleIncrement = () => setQuantity(Math.min(maxQuantity, quantity + 1));

  return (
    <div className="flex flex-col gap-4 mt-8">
      <div className="flex items-center gap-4">
        {/* Quantity */}
        <div className="flex items-center border rounded-md h-12 bg-background">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1 || disabled}
            className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-medium text-sm">{quantity}</span>
          <button
            onClick={handleIncrement}
            disabled={quantity >= maxQuantity || disabled}
            className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart */}
        <Button
          size="lg"
          className="flex-1 h-12"
          onClick={onAddToCart}
          disabled={disabled || isOutOfStock || isAdding}
        >
          {isAdding ? (
            <span className="animate-pulse">Adding...</span>
          ) : isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>

        {/* Wishlist */}
        <Button size="icon" variant="outline" className="h-12 w-12 shrink-0">
          <Heart className="w-5 h-5" />
        </Button>
      </div>

      <Button
        size="lg"
        variant="secondary"
        className="w-full h-12"
        onClick={onBuyNow}
        disabled={disabled || isOutOfStock}
      >
        Buy it now
      </Button>
    </div>
  );
}
