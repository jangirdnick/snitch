import { useEffect, useState, useRef, useCallback } from 'react';
import type { Category, Product } from '@snitch/types';
import { categoryService } from '@/features/admin/category/service/category.api';
import { getLimitedProducts, getAllProducts } from '@/features/admin/inventory/service/product.api';
import { FeaturedCategories } from './FeaturedCategories';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';
import { ChevronLeft, ChevronRight, Flame, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function FeaturedProductsSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Responsive limit state: Laptop (20), Tablet (15), Mobile (15)
  const [productLimit, setProductLimit] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024 ? 20 : 15;
    }
    return 20;
  });

  useEffect(() => {
    const handleResize = () => {
      const newLimit = window.innerWidth >= 1024 ? 20 : 15;
      setProductLimit((prev) => (prev !== newLimit ? newLimit : prev));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch top categories (up to 15)
  useEffect(() => {
    let isMounted = true;

    categoryService
      .getAll({ limit: 15, status: 'active' })
      .then((data) => {
        if (isMounted) {
          setCategories(data.items || []);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingCategories(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch featured products based on responsive limit & selected category
  const fetchProducts = useCallback(async () => {
    setError(null);

    try {
      if (selectedCategoryId) {
        // Fetch products filtered by selected category
        const response = await getAllProducts({
          limit: productLimit,
          category: selectedCategoryId,
          status: 'active',
        });
        if (response.success && 'items' in response.data) {
          setProducts(response.data.items || []);
        } else {
          setProducts([]);
        }
      } else {
        // Fetch limited products for homepage (20 laptop, 15 tablet/mobile)
        const response = await getLimitedProducts(productLimit);
        if (response.success && response.data?.products) {
          setProducts(response.data.products || []);
        } else {
          setProducts([]);
        }
      }
    } catch (err: unknown) {
      console.error('Failed to fetch featured products:', err);
      setError('Unable to load featured products.');
    } finally {
      setIsLoadingProducts(false);
    }
  }, [selectedCategoryId, productLimit]);

  useEffect(() => {
    void (async () => {
      await fetchProducts();
    })();
  }, [fetchProducts]);

  const handleSelectCategory = (catId: string | null) => {
    setIsLoadingProducts(true);
    setSelectedCategoryId(catId);
  };

  const handleRetry = () => {
    setIsLoadingProducts(true);
    fetchProducts();
  };

  // Check scroll positions for arrow button states
  const checkScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => {
    checkScrollState();
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollState, { passive: true });
      window.addEventListener('resize', checkScrollState);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollState);
      }
      window.removeEventListener('resize', checkScrollState);
    };
  }, [products, checkScrollState]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const containerWidth = scrollRef.current.clientWidth;
    const scrollAmount = direction === 'left' ? -containerWidth * 0.8 : containerWidth * 0.8;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="w-full h-full bg-[#08060d]/80 text-white relative overflow-hidden border-t border-white/10 rounded-t-3xl backdrop-blur-md flex flex-col justify-between p-3 sm:p-4 lg:p-5 select-none">
      {/* ── Top Header Row & Categories (Compact Single Line) ───────────────── */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10 shrink-0 relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider shrink-0">
            <Flame className="w-3.5 h-3.5" />
            <span>Featured</span>
          </div>

          <div className="min-w-0 flex-1 overflow-x-auto scrollbar-none">
            <FeaturedCategories
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleSelectCategory}
              isLoading={isLoadingCategories}
            />
          </div>
        </div>

        {/* Carousel Prev / Next Arrow Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous products"
            className={cn(
              'p-1.5 sm:p-2 rounded-full border transition-all duration-300 focus:outline-none',
              canScrollLeft
                ? 'bg-white/10 text-white border-white/20 hover:bg-amber-500 hover:text-black hover:border-amber-400 active:scale-95 shadow'
                : 'bg-white/5 text-zinc-600 border-white/5 cursor-not-allowed opacity-40',
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next products"
            className={cn(
              'p-1.5 sm:p-2 rounded-full border transition-all duration-300 focus:outline-none',
              canScrollRight
                ? 'bg-white/10 text-white border-white/20 hover:bg-amber-500 hover:text-black hover:border-amber-400 active:scale-95 shadow'
                : 'bg-white/5 text-zinc-600 border-white/5 cursor-not-allowed opacity-40',
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Products Carousel Showcase (Flex 1 to Fill Height) ─────────────── */}
      <div className="flex-1 min-h-0 w-full relative z-10 pt-2">
        {isLoadingProducts ? (
          /* Loading Skeleton Carousel — Matching User Responsive Card Style */
          <div className="w-full h-full flex gap-2.5 sm:gap-3 overflow-hidden py-0.5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="snap-start shrink-0 h-full w-[calc(46%-8px)] sm:w-[calc(36%-8px)] md:w-[calc(26%-8px)] lg:w-[calc(22%-9px)] xl:w-[calc(16.6666%-10px)] flex flex-col gap-1.5 rounded-xl bg-zinc-900/60 p-2 border border-white/10"
              >
                <Skeleton className="w-full flex-1 rounded-lg bg-zinc-800/50" />
                <Skeleton className="h-3 w-2/3 bg-zinc-800/50" />
                <Skeleton className="h-3 w-1/2 bg-zinc-800/50" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-900/60 rounded-xl border border-white/10">
            <p className="text-zinc-300 text-xs mb-2">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-900/60 rounded-xl border border-white/10">
            <p className="text-zinc-400 text-xs">No products found in this category.</p>
            <button
              type="button"
              onClick={() => handleSelectCategory(null)}
              className="mt-2 text-xs text-amber-400 hover:underline font-medium"
            >
              View all items
            </button>
          </div>
        ) : (
          /* Horizontal Carousel using exact user responsive card widths */
          <div
            ref={scrollRef}
            className="w-full h-full flex gap-2.5 sm:gap-3 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory py-0.5"
          >
            {products.map((prod) => (
              <div
                key={prod._id || prod.id}
                className="snap-start shrink-0 h-full w-[calc(46%-8px)] sm:w-[calc(36%-8px)] md:w-[calc(26%-8px)] lg:w-[calc(22%-9px)] xl:w-[calc(16.6666%-10px)]"
              >
                <ProductCard product={prod} onQuickView={(p) => setQuickViewProduct(p)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal Dialog */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
