import { useState, useEffect } from 'react';
import { getProductReviews } from '../service/review.api';
import { Star, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ReviewResponseDto } from '@snitch/types';

export default function ReviewSection({
  productId,
  averageRating,
  totalCount,
}: {
  productId: string;
  averageRating: number;
  totalCount: number;
}) {
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await getProductReviews(productId, page, 5);
        if (res.success && isMounted) {
          if (page === 1) {
            setReviews(res.data.items);
          } else {
            setReviews((prev) => [...prev, ...res.data.items]);
          }
          setHasMore(res.data.pagination.hasNextPage);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, [productId, page]);

  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Rating Summary */}
        <div className="md:col-span-4 flex flex-col items-start bg-muted/30 p-6 rounded-lg h-fit border">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl font-bold">
              {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
            </span>
            <div className="flex flex-col">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'fill-current' : 'text-muted-foreground/30 stroke-current'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground mt-1 font-medium">
                Based on {totalCount} reviews
              </span>
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {reviews.length === 0 && !loading ? (
            <div className="p-8 text-center bg-muted/20 border rounded-lg border-dashed">
              <p className="text-muted-foreground font-medium">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {review.user?.avatar ? (
                      <img
                        src={review.user.avatar}
                        alt={review.user.firstName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-border"
                      />
                    ) : (
                      <UserCircle2 className="w-10 h-10 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {review.user?.firstName} {review.user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-muted-foreground/30 stroke-current'}`}
                      />
                    ))}
                  </div>
                </div>
                <h4 className="font-semibold text-foreground mt-3">{review.title}</h4>
                <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
                  {review.content}
                </p>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-center py-4">
              <span className="animate-pulse text-sm text-muted-foreground font-medium">
                Loading reviews...
              </span>
            </div>
          )}

          {hasMore && !loading && (
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              className="self-center mt-4"
            >
              Load More Reviews
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
