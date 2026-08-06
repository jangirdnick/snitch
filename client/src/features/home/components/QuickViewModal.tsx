import { useState } from 'react';
import type { Product } from '@snitch/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const navigate = useNavigate();

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const colorVariant = product.colors?.[selectedColorIdx] ?? product.colors?.[0];
  const images = colorVariant?.images ?? [];
  const activeImage = images[selectedImageIdx]?.url || images[0]?.url || '';

  const sizes = colorVariant?.sizes ?? [];
  const currentPrice = product.price?.amount ?? 0;
  const comparePrice = product.price?.compareAtAmount;

  let discountPercent: number | null = null;
  if (comparePrice && comparePrice > currentPrice) {
    discountPercent = Math.round(((comparePrice - currentPrice) / comparePrice) * 100);
  }

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      showToast.warning('Please select a size', {
        description: 'Choose your desired size before adding to bag.',
      });
      return;
    }

    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      showToast.success('Added to Shopping Bag!', {
        description: `${product.title} (${colorVariant?.name ?? ''} ${selectedSize ? `/ Size ${selectedSize}` : ''})`,
      });
      onClose();
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl bg-zinc-950/95 border-white/10 text-white backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.title} Quick View</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-h-[85vh] overflow-y-auto">
          {/* ── Left Column: Media Gallery ────────────────────────────────────── */}
          <div className="flex flex-col bg-zinc-900/40 p-4 gap-3">
            {/* Main Display Image */}
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 border border-white/10">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover object-top transition-all duration-300"
              />
              {discountPercent && (
                <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold bg-amber-500 text-black rounded-md shadow-md">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                {images.map((img, idx) => (
                  <button
                    key={img.url + idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={cn(
                      'w-14 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all duration-200',
                      selectedImageIdx === idx
                        ? 'border-amber-400 opacity-100 scale-105'
                        : 'border-white/10 opacity-60 hover:opacity-100',
                    )}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right Column: Details & Actions ───────────────────────────────── */}
          <div className="flex flex-col p-6 gap-4 justify-between">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs text-amber-400/90 font-medium mb-1">
                <span className="uppercase tracking-wider">Featured Item</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-zinc-200">4.9 (84 reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-white tracking-tight">{product.title}</h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 my-3">
                <span className="text-2xl font-extrabold text-white">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {comparePrice && comparePrice > currentPrice && (
                  <span className="text-base text-zinc-500 line-through">
                    ₹{comparePrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-3 mb-4">
                {product.description ||
                  'Premium quality apparel crafted with precision for effortless comfort and luxury style.'}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-zinc-300 font-medium mb-2">
                    <span>
                      Color: <strong className="text-amber-400">{colorVariant?.name}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((color, idx) => (
                      <button
                        key={color.hex + idx}
                        type="button"
                        onClick={() => {
                          setSelectedColorIdx(idx);
                          setSelectedImageIdx(0);
                        }}
                        className={cn(
                          'w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center',
                          selectedColorIdx === idx
                            ? 'border-amber-400 ring-2 ring-amber-400/40 scale-110'
                            : 'border-white/20 opacity-70 hover:opacity-100',
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColorIdx === idx && (
                          <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {sizes.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-zinc-300 font-medium mb-2">
                    <span>Select Size</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => {
                      const isDisabled = s.stock <= 0;
                      const isSelected = selectedSize === s.size;
                      return (
                        <button
                          key={s.size}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => setSelectedSize(s.size)}
                          className={cn(
                            'px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all',
                            isDisabled
                              ? 'border-zinc-800 text-zinc-600 line-through cursor-not-allowed bg-zinc-900/30'
                              : isSelected
                                ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                                : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/30 hover:bg-white/10',
                          )}
                        >
                          {s.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm hover:from-amber-400 hover:to-amber-500 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAdding ? 'Adding to Bag...' : 'Add to Shopping Bag'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/product/${product.slug}`);
                }}
                className="w-full text-center py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                View Full Product Details →
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
