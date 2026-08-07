import { cn } from '@/lib/utils';

interface VariantSelectorProps {
  colors: {
    name: string;
    hex: string;
    sizes: { size: string; stock: number; sku: string }[];
  }[];
  selectedColorIndex: number;
  onColorChange: (index: number) => void;
  selectedSizeSku: string | null;
  onSizeChange: (sku: string) => void;
}

export default function VariantSelector({
  colors,
  selectedColorIndex,
  onColorChange,
  selectedSizeSku,
  onSizeChange,
}: VariantSelectorProps) {
  if (!colors || colors.length === 0) return null;

  const activeColor = colors[selectedColorIndex];

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* Colors */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">
          Color: <span className="text-muted-foreground ml-1">{activeColor?.name}</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {colors.map((color, idx) => (
            <button
              key={idx}
              onClick={() => onColorChange(idx)}
              className={cn(
                'w-10 h-10 rounded-full border-2 focus:outline-none transition-all',
                selectedColorIndex === idx
                  ? 'border-primary scale-110 shadow-sm'
                  : 'border-transparent hover:scale-105',
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Select color ${color.name}`}
            >
              {/* Add an inner ring if color is very light (like white) */}
              <span className="block w-full h-full rounded-full border border-black/10" />
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      {activeColor && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Select Size</span>
            <button className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4">
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeColor.sizes.map((sizeObj) => {
              const isOutOfStock = sizeObj.stock === 0;
              const isSelected = selectedSizeSku === sizeObj.sku;

              return (
                <button
                  key={sizeObj.sku}
                  disabled={isOutOfStock}
                  onClick={() => onSizeChange(sizeObj.sku)}
                  className={cn(
                    'flex items-center justify-center min-w-12 h-10 px-3 rounded-md border text-sm font-medium transition-all',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background hover:bg-accent hover:text-accent-foreground',
                    isOutOfStock &&
                      'opacity-50 cursor-not-allowed bg-muted hover:bg-muted text-muted-foreground border-dashed',
                  )}
                  title={isOutOfStock ? 'Out of Stock' : `Select size ${sizeObj.size}`}
                >
                  {sizeObj.size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
