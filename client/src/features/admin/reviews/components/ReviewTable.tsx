import { cn } from '@/lib/utils';
import { Star, ShieldOff, MoreHorizontal, Trash } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ReviewStatusBadge } from './ReviewStatusBadge';
import type { ReviewResponseDto } from '@snitch/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReviewTableProps {
  items: ReviewResponseDto[];
  loading: boolean;
  onUpdateStatus: (id: string, status: 'active' | 'blocked' | 'reported') => void;
  onDelete: (id: string) => void;
  onToggleUserPermission: (userId: string, currentPermission: boolean) => void;
}

export function ReviewTable({
  items,
  loading,
  onUpdateStatus,
  onDelete,
  onToggleUserPermission,
}: ReviewTableProps) {
  if (loading) {
    return (
      <div className="h-full min-h-[400px] flex items-center justify-center text-[oklch(0.6_0_0)]">
        Loading reviews...
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-[oklch(0.6_0_0)] gap-4">
        <Star className="h-12 w-12 opacity-20" />
        <p>No reviews found</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-[oklch(1_0_0_/_0.055)] hover:bg-transparent">
            <TableHead className="text-[oklch(0.6_0_0)] text-xs font-medium w-[250px]">
              Product
            </TableHead>
            <TableHead className="text-[oklch(0.6_0_0)] text-xs font-medium w-[200px]">
              User
            </TableHead>
            <TableHead className="text-[oklch(0.6_0_0)] text-xs font-medium">Review</TableHead>
            <TableHead className="text-[oklch(0.6_0_0)] text-xs font-medium w-[120px]">
              Rating
            </TableHead>
            <TableHead className="text-[oklch(0.6_0_0)] text-xs font-medium w-[120px]">
              Status
            </TableHead>
            <TableHead className="text-[oklch(0.6_0_0)] text-xs font-medium w-[60px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((review) => (
            <TableRow
              key={review.id}
              className="group border-b-[oklch(1_0_0_/_0.03)] hover:bg-[oklch(1_0_0_/_0.02)] transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-[oklch(0.18_0.005_260)] border border-[oklch(1_0_0_/_0.08)] overflow-hidden shrink-0 flex items-center justify-center">
                    {review.product.primaryImage ? (
                      <img
                        src={review.product.primaryImage}
                        alt={review.product.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-[10px] text-[oklch(0.5_0_0)]">No Img</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-[oklch(0.95_0_0)] truncate">
                      {review.product.title}
                    </span>
                    <span className="text-xs text-[oklch(0.5_0_0)] truncate mt-0.5">
                      {review.product.slug}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-[oklch(1_0_0_/_0.1)]">
                    <AvatarImage src={review.user.avatar || undefined} />
                    <AvatarFallback className="bg-[oklch(0.2_0.02_260)] text-[10px]">
                      {review.user.firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-[oklch(0.95_0_0)] truncate">
                      {review.user.firstName} {review.user.lastName}
                    </span>
                    <span className="text-[10px] text-[oklch(0.5_0_0)] truncate">
                      {review.user.email}
                    </span>
                    {!review.user.canReview && (
                      <span className="text-[9px] text-[oklch(0.65_0.20_22)] font-medium mt-0.5">
                        [Review Blocked]
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[oklch(0.95_0_0)] mb-1">
                    {review.title}
                  </span>
                  <span className="text-xs text-[oklch(0.7_0_0)] line-clamp-2">
                    {review.content}
                  </span>
                  {review.isEdited && (
                    <span className="text-[10px] text-[oklch(0.5_0_0)] mt-1 italic">Edited</span>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-3.5 h-3.5',
                        i < review.rating
                          ? 'fill-[oklch(0.85_0.15_80)] text-[oklch(0.85_0.15_80)]'
                          : 'fill-[oklch(0.25_0_0)] text-[oklch(0.25_0_0)]',
                      )}
                    />
                  ))}
                </div>
              </TableCell>

              <TableCell>
                <ReviewStatusBadge status={review.status} />
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4 text-[oklch(0.6_0_0)]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[180px] bg-[oklch(0.18_0.005_260)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] rounded-xl shadow-[0_8px_32px_oklch(0_0_0_/_0.6)]"
                  >
                    <DropdownMenuLabel className="text-xs font-normal text-[oklch(0.55_0_0)]">
                      Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[oklch(1_0_0_/_0.08)]" />

                    {review.status !== 'active' && (
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(review.id, 'active')}
                        className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)] cursor-pointer"
                      >
                        Approve (Active)
                      </DropdownMenuItem>
                    )}
                    {review.status !== 'blocked' && (
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(review.id, 'blocked')}
                        className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)] cursor-pointer"
                      >
                        Block Review
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator className="bg-[oklch(1_0_0_/_0.08)]" />
                    <DropdownMenuItem
                      onClick={() => onToggleUserPermission(review.user.id, review.user.canReview)}
                      className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)] cursor-pointer gap-2"
                    >
                      <ShieldOff className="h-3.5 w-3.5" />
                      {review.user.canReview ? 'Block User from Reviews' : 'Allow User to Review'}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-[oklch(1_0_0_/_0.08)]" />
                    <DropdownMenuItem
                      onClick={() => onDelete(review.id)}
                      className="focus:bg-[oklch(0.5_0.2_22_/_0.2)] focus:text-[oklch(0.65_0.2_22)] text-[oklch(0.65_0.2_22)] cursor-pointer gap-2"
                    >
                      <Trash className="h-3.5 w-3.5" />
                      Delete Review
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
