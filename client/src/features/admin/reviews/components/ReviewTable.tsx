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
import { Skeleton } from '@/components/ui/skeleton';

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
      <div className="w-full h-full p-4 md:p-6">
        {/* Desktop Skeleton */}
        <div className="hidden md:flex h-full min-h-[300px] items-center justify-center text-[oklch(0.6_0_0)]">
          Loading reviews...
        </div>

        {/* Mobile Skeleton Cards */}
        <div className="block md:hidden space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-[oklch(1_0_0/0.065)] bg-[oklch(1_0_0/0.02)] space-y-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-md bg-[oklch(1_0_0/0.06)]" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-36 bg-[oklch(1_0_0/0.06)]" />
                  <Skeleton className="h-3 w-24 bg-[oklch(1_0_0/0.06)]" />
                </div>
              </div>
              <div className="space-y-1 py-1">
                <Skeleton className="h-4 w-28 bg-[oklch(1_0_0/0.06)]" />
                <Skeleton className="h-3 w-full bg-[oklch(1_0_0/0.06)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-20 text-[oklch(0.6_0_0)] gap-3 text-center px-4">
        <Star className="h-10 w-10 md:h-12 md:w-12 opacity-20" />
        <p className="text-sm font-medium">No reviews found</p>
        <p className="text-xs opacity-70">Try adjusting your filters or search options.</p>
      </div>
    );
  }

  return (
    <>
      {/* DESKTOP TABLE VIEW (Enhanced for md+) */}
      <div className="hidden md:block relative w-full overflow-auto rounded-xl border border-[oklch(1_0_0_/_0.06)] bg-[oklch(0.12_0.005_260_/_0.4)]">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.02)] hover:bg-transparent">
              <TableHead className="text-[oklch(0.6_0_0)] text-[11px] font-semibold uppercase tracking-wider py-3.5 px-4 w-[240px]">
                Product
              </TableHead>
              <TableHead className="text-[oklch(0.6_0_0)] text-[11px] font-semibold uppercase tracking-wider py-3.5 px-4 w-[200px]">
                Customer
              </TableHead>
              <TableHead className="text-[oklch(0.6_0_0)] text-[11px] font-semibold uppercase tracking-wider py-3.5 px-4">
                Review Details
              </TableHead>
              <TableHead className="text-[oklch(0.6_0_0)] text-[11px] font-semibold uppercase tracking-wider py-3.5 px-4 w-[140px]">
                Rating
              </TableHead>
              <TableHead className="text-[oklch(0.6_0_0)] text-[11px] font-semibold uppercase tracking-wider py-3.5 px-4 w-[130px]">
                Status
              </TableHead>
              <TableHead className="text-[oklch(0.6_0_0)] text-[11px] font-semibold uppercase tracking-wider py-3.5 px-4 w-[70px] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((review) => (
              <TableRow
                key={review.id}
                className="group border-b-[oklch(1_0_0_/_0.04)] hover:bg-[oklch(1_0_0_/_0.03)] transition-colors duration-200"
              >
                {/* Product Info */}
                <TableCell className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[oklch(0.18_0.005_260)] border border-[oklch(1_0_0_/_0.1)] overflow-hidden shrink-0 flex items-center justify-center shadow-xs group-hover:border-[oklch(1_0_0_/_0.2)] transition-colors">
                      {review.product.primaryImage ? (
                        <img
                          src={review.product.primaryImage}
                          alt={review.product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-[10px] text-[oklch(0.5_0_0)]">No Img</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold text-[oklch(0.95_0_0)] truncate leading-tight">
                        {review.product.title}
                      </span>
                      <span className="text-[11px] text-[oklch(0.5_0_0)] truncate mt-0.5 font-mono">
                        {review.product.slug}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* User Info */}
                <TableCell className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8 border border-[oklch(1_0_0_/_0.12)] shrink-0">
                      <AvatarImage src={review.user.avatar || undefined} />
                      <AvatarFallback className="bg-[oklch(0.2_0.02_260)] text-[10px] font-bold text-[oklch(0.9_0_0)]">
                        {review.user.firstName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-medium text-[oklch(0.95_0_0)] truncate leading-tight">
                        {review.user.firstName} {review.user.lastName}
                      </span>
                      <span className="text-[11px] text-[oklch(0.5_0_0)] truncate">
                        {review.user.email}
                      </span>
                      {!review.user.canReview && (
                        <span className="text-[9px] text-[oklch(0.65_0.20_22)] font-semibold mt-0.5 tracking-wide">
                          [Review Blocked]
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Review Title & Content */}
                <TableCell className="px-4 py-3.5">
                  <div className="flex flex-col max-w-[320px]">
                    <span className="text-[13px] font-semibold text-[oklch(0.95_0_0)] mb-0.5 leading-snug">
                      {review.title}
                    </span>
                    <span className="text-[12px] text-[oklch(0.7_0_0)] line-clamp-2 leading-relaxed">
                      {review.content}
                    </span>
                    {review.isEdited && (
                      <span className="text-[10px] text-[oklch(0.5_0_0)] mt-1 italic">
                        (Edited)
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Rating Badge */}
                <TableCell className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 bg-[oklch(1_0_0_/_0.03)] border border-[oklch(1_0_0_/_0.07)] px-2.5 py-1 rounded-lg w-fit">
                    <Star className="w-3.5 h-3.5 fill-[oklch(0.85_0.15_80)] text-[oklch(0.85_0.15_80)] shrink-0" />
                    <span className="text-[12px] font-bold text-[oklch(0.95_0_0)] font-mono">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                </TableCell>

                {/* Status Badge */}
                <TableCell className="px-4 py-3.5">
                  <ReviewStatusBadge status={review.status} />
                </TableCell>

                {/* Actions Dropdown */}
                <TableCell className="px-4 py-3.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 opacity-80 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-[oklch(1_0_0_/_0.08)] rounded-lg transition-opacity"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4 text-[oklch(0.7_0_0)]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-[195px] bg-[oklch(0.14_0.005_260)] border-[oklch(1_0_0_/_0.1)] text-[oklch(0.95_0_0)] rounded-xl shadow-[0_12px_40px_oklch(0_0_0_/_0.7)] p-1.5"
                    >
                      <DropdownMenuLabel className="text-[10px] uppercase font-bold text-[oklch(0.5_0_0)] px-2 py-1 tracking-wider">
                        Review Moderation
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-[oklch(1_0_0_/_0.08)] my-1" />

                      {review.status !== 'active' && (
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(review.id, 'active')}
                          className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)] cursor-pointer rounded-lg px-2 py-2 text-xs font-medium"
                        >
                          Approve (Active)
                        </DropdownMenuItem>
                      )}
                      {review.status !== 'blocked' && (
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(review.id, 'blocked')}
                          className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)] cursor-pointer rounded-lg px-2 py-2 text-xs font-medium"
                        >
                          Block Review
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator className="bg-[oklch(1_0_0_/_0.08)] my-1" />
                      <DropdownMenuItem
                        onClick={() =>
                          onToggleUserPermission(review.user.id, review.user.canReview)
                        }
                        className="focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)] cursor-pointer gap-2 rounded-lg px-2 py-2 text-xs font-medium"
                      >
                        <ShieldOff className="h-3.5 w-3.5 text-amber-400" />
                        {review.user.canReview ? 'Block User from Reviews' : 'Allow User to Review'}
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="bg-[oklch(1_0_0_/_0.08)] my-1" />
                      <DropdownMenuItem
                        onClick={() => onDelete(review.id)}
                        className="focus:bg-[oklch(0.5_0.2_22_/_0.2)] focus:text-[oklch(0.65_0.2_22)] text-[oklch(0.65_0.2_22)] cursor-pointer gap-2 rounded-lg px-2 py-2 text-xs font-medium"
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

      {/* MOBILE RESPONSIVE CARDS VIEW (block md:hidden) */}
      <div className="block md:hidden p-3 sm:p-4 space-y-3">
        {items.map((review) => (
          <div
            key={review.id}
            className={cn(
              'rounded-xl p-4 transition-all duration-300',
              'bg-gradient-to-b from-[oklch(0.14_0.005_260)] to-[oklch(0.12_0.005_260)]',
              'border border-[oklch(1_0_0/0.07)] hover:border-[oklch(1_0_0/0.14)]',
              'shadow-sm flex flex-col gap-3',
            )}
          >
            {/* Top row: Product image & title + Status badge + Actions */}
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[oklch(1_0_0/0.05)]">
              <div className="flex items-center gap-3 min-w-0 flex-1">
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
                  <span className="text-sm font-semibold text-[oklch(0.95_0_0)] truncate">
                    {review.product.title}
                  </span>
                  <span className="text-[11px] text-[oklch(0.5_0_0)] truncate">
                    {review.product.slug}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <ReviewStatusBadge status={review.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 text-[oklch(0.6_0_0)] hover:text-[oklch(0.95_0_0)] hover:bg-[oklch(1_0_0/0.08)] rounded-lg active:scale-95"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[190px] bg-[oklch(0.18_0.005_260)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] rounded-xl shadow-xl"
                  >
                    <DropdownMenuLabel className="text-xs font-normal text-[oklch(0.55_0_0)]">
                      Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[oklch(1_0_0_/_0.08)]" />

                    {review.status !== 'active' && (
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(review.id, 'active')}
                        className="cursor-pointer py-2.5"
                      >
                        Approve (Active)
                      </DropdownMenuItem>
                    )}
                    {review.status !== 'blocked' && (
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(review.id, 'blocked')}
                        className="cursor-pointer py-2.5"
                      >
                        Block Review
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator className="bg-[oklch(1_0_0_/_0.08)]" />
                    <DropdownMenuItem
                      onClick={() => onToggleUserPermission(review.user.id, review.user.canReview)}
                      className="cursor-pointer gap-2 py-2.5"
                    >
                      <ShieldOff className="h-3.5 w-3.5 text-amber-400" />
                      {review.user.canReview ? 'Block User from Reviews' : 'Allow User to Review'}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-[oklch(1_0_0_/_0.08)]" />
                    <DropdownMenuItem
                      onClick={() => onDelete(review.id)}
                      className="text-[oklch(0.65_0.2_22)] cursor-pointer gap-2 py-2.5"
                    >
                      <Trash className="h-3.5 w-3.5" />
                      Delete Review
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Rating Stars & Title */}
            <div>
              <div className="flex items-center gap-1 mb-1">
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
              <h4 className="text-sm font-bold text-[oklch(0.95_0_0)] leading-snug">
                {review.title}
              </h4>
              <p className="text-xs text-[oklch(0.75_0_0)] mt-1 leading-relaxed">
                {review.content}
              </p>
              {review.isEdited && (
                <span className="text-[10px] text-[oklch(0.5_0_0)] italic mt-1 block">Edited</span>
              )}
            </div>

            {/* User row */}
            <div className="flex items-center justify-between pt-2 border-t border-[oklch(1_0_0/0.05)]">
              <div className="flex items-center gap-2 min-w-0">
                <Avatar className="h-7 w-7 border border-[oklch(1_0_0_/_0.1)] shrink-0">
                  <AvatarImage src={review.user.avatar || undefined} />
                  <AvatarFallback className="bg-[oklch(0.2_0.02_260)] text-[9px]">
                    {review.user.firstName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0 text-[11px]">
                  <span className="text-[oklch(0.9_0_0)] font-medium truncate">
                    {review.user.firstName} {review.user.lastName}
                  </span>
                  <span className="text-[oklch(0.5_0_0)] truncate text-[10px]">
                    {review.user.email}
                  </span>
                </div>
              </div>
              {!review.user.canReview && (
                <span className="text-[9px] text-[oklch(0.65_0.20_22)] font-semibold bg-[oklch(0.65_0.20_22_/_0.1)] px-2 py-0.5 rounded-md shrink-0">
                  [Review Blocked]
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
