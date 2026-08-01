import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Review } from '@snitch/types';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { MessageSquare, Star } from 'lucide-react';
import dayjs from 'dayjs';

interface Props {
  reviews: Review[];
}

export function RecentReviewsWidget({ reviews }: Props) {
  return (
    <Card className="col-span-1 lg:col-span-2 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              Recent Reviews
            </CardTitle>
            <CardDescription>Latest customer feedback</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="h-8" asChild>
            <Link to="/admin/reviews">Manage</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">No recent reviews</div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="flex flex-col gap-2 pb-4 border-b last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium">{review.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-muted text-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground border-l pl-2">
                        {typeof review.user === 'object'
                          ? `${review.user.firstName} ${review.user.lastName || ''}`
                          : 'User'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {dayjs(review.createdAt).format('MMM D')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{review.content}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
