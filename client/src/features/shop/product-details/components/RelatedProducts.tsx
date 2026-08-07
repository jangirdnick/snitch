import { useState, useEffect } from 'react';
import { getAllProducts } from '../../../admin/inventory/service/product.api';
import type { Product } from '@snitch/types';
import { Link } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';

export default function RelatedProducts({
  categoryId,
  currentProductId,
}: {
  categoryId: string;
  currentProductId: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRelated = async () => {
      try {
        const res = await getAllProducts({ category: categoryId, limit: 5 });
        if (res.success && isMounted) {
          // Filter out current product and take 4
          const related = res.data.items.filter((p) => p.id !== currentProductId).slice(0, 4);
          setProducts(related);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (categoryId) fetchRelated();
    return () => {
      isMounted = false;
    };
  }, [categoryId, currentProductId]);

  if (loading) {
    return <div className="mt-16 h-64 bg-muted animate-pulse rounded-lg" />;
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => {
          // Get primary image of default color
          const defaultColor = product.colors.find((c) => c.isDefault) || product.colors[0];
          const primaryImage =
            defaultColor?.images.find((img) => img.isPrimary)?.url || defaultColor?.images[0]?.url;

          return (
            <Link key={product.id} to={`/product/${product.slug}`} className="group">
              <Card className="border-0 shadow-none bg-transparent h-full">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted mb-3 relative">
                    {primaryImage ? (
                      <img
                        src={primaryImage}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-col flex-1 justify-between">
                    <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors mb-1">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-auto">
                      <span className="font-semibold text-sm">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: product.price.currency,
                        }).format(product.price.amount)}
                      </span>
                      {product.price.compareAtAmount &&
                        product.price.compareAtAmount > product.price.amount && (
                          <span className="text-xs text-muted-foreground line-through">
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: product.price.currency,
                            }).format(product.price.compareAtAmount)}
                          </span>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
