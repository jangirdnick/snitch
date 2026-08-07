import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useProduct } from '@/features/admin/inventory/hook/useProduct';
import { useAppSelector } from '@/store/hooks';
import type { ProductColorVariant, ProductSizeStock } from '@snitch/types';
import ProductGallery from '@/features/shop/product-details/components/ProductGallery';
import ProductInfo from '@/features/shop/product-details/components/ProductInfo';
import VariantSelector from '@/features/shop/product-details/components/VariantSelector';
import AddToCartSection from '@/features/shop/product-details/components/AddToCartSection';
import CouponCard from '@/features/shop/product-details/components/CouponCard';
import ProductTabs from '@/features/shop/product-details/components/ProductTabs';
import ReviewSection from '@/features/shop/product-details/components/ReviewSection';
import RelatedProducts from '@/features/shop/product-details/components/RelatedProducts';
import { showToast } from '@/lib/toast';

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { handleGetProductBySlug } = useProduct();
  const { currentProduct, loading, error } = useAppSelector((state) => state.product);

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeSku, setSelectedSizeSku] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [prevProductId, setPrevProductId] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      handleGetProductBySlug(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (currentProduct && currentProduct.id !== prevProductId) {
    setPrevProductId(currentProduct.id);
    const defaultIdx =
      currentProduct.colors?.findIndex((c: ProductColorVariant) => c.isDefault) ?? -1;
    setSelectedColorIndex(defaultIdx !== -1 ? defaultIdx : 0);
    setSelectedSizeSku(null);
    setQuantity(1);
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 animate-pulse">
          <div className="bg-muted aspect-3/4 rounded-lg" />
          <div className="space-y-6">
            <div className="h-10 bg-muted rounded w-3/4" />
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-32 bg-muted rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-7xl">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground">
          {error || 'The product you are looking for does not exist.'}
        </p>
      </div>
    );
  }

  const activeColor = currentProduct.colors?.[selectedColorIndex];
  const selectedSize = activeColor?.sizes?.find((s: ProductSizeStock) => s.sku === selectedSizeSku);
  const isOutOfStock = activeColor && selectedSizeSku ? selectedSize?.stock === 0 : false;
  const maxQuantity = selectedSize?.stock || 1;

  const handleAddToCart = () => {
    if (!selectedSizeSku) {
      showToast.error('Please select a size first');
      return;
    }

    setIsAddingToCart(true);
    // Mock API call to cart slice
    setTimeout(() => {
      setIsAddingToCart(false);
      showToast.success(`Added ${quantity} ${currentProduct.title} to cart`);
    }, 600);
  };

  const handleBuyNow = () => {
    if (!selectedSizeSku) {
      showToast.error('Please select a size first');
      return;
    }
    showToast.success('Redirecting to checkout...');
  };

  // Get category ID safely
  const firstCategory = currentProduct.category?.[0];
  const categoryId =
    typeof firstCategory === 'string'
      ? firstCategory
      : typeof firstCategory === 'object' && firstCategory !== null
        ? (firstCategory as { id?: string; _id?: string }).id ||
          (firstCategory as { id?: string; _id?: string })._id ||
          ''
        : '';

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left Column - Gallery */}
        <div className="lg:sticky lg:top-24 h-fit">
          <ProductGallery images={activeColor?.images || []} />
        </div>

        {/* Right Column - Info */}
        <div className="flex flex-col">
          <ProductInfo product={currentProduct} />

          <VariantSelector
            colors={currentProduct.colors || []}
            selectedColorIndex={selectedColorIndex}
            onColorChange={(idx) => {
              setSelectedColorIndex(idx);
              setSelectedSizeSku(null);
              setQuantity(1);
            }}
            selectedSizeSku={selectedSizeSku}
            onSizeChange={setSelectedSizeSku}
          />

          <AddToCartSection
            quantity={quantity}
            setQuantity={setQuantity}
            maxQuantity={maxQuantity}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            isAdding={isAddingToCart}
            isOutOfStock={isOutOfStock}
            disabled={!selectedSizeSku}
          />

          <CouponCard orderAmount={(currentProduct.price?.amount || 0) * quantity} />

          <ProductTabs product={currentProduct} />
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection
        productId={currentProduct.id}
        averageRating={currentProduct.review?.average || 0}
        totalCount={currentProduct.review?.count || 0}
      />

      {/* Related Products Section */}
      {categoryId && (
        <RelatedProducts categoryId={categoryId} currentProductId={currentProduct.id} />
      )}
    </div>
  );
}
