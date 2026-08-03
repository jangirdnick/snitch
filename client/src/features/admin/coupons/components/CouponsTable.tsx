import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Coupon } from '@snitch/types';
import { CouponActions } from './CouponActions';
import { Ticket, CalendarDays, Percent, Banknote, Users, Box } from 'lucide-react';

interface CouponsTableProps {
  coupons: Coupon[];
  isLoading: boolean;
  onEdit: (coupon: Coupon) => void;
  onDeleteConfirm: (id: string) => Promise<boolean>;
}

const getStatusBadge = (isActive: boolean, validUntil: string | Date) => {
  const isExpired = new Date(validUntil) < new Date();

  if (!isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10.5px] font-semibold tracking-wide whitespace-nowrap bg-[oklch(0.42_0_0_/_0.08)] text-[oklch(0.50_0_0)] border-[oklch(0.42_0_0_/_0.18)]">
        <span className="size-1.5 rounded-full shrink-0 bg-[oklch(0.42_0_0)] shadow-[0_0_6px_oklch(0.42_0_0_/_0.4)]" />
        Inactive
      </span>
    );
  }
  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10.5px] font-semibold tracking-wide whitespace-nowrap bg-[oklch(0.65_0.20_22_/_0.1)] text-[oklch(0.65_0.20_22)] border-[oklch(0.65_0.20_22_/_0.2)]">
        <span className="size-1.5 rounded-full shrink-0 bg-[oklch(0.65_0.20_22)] shadow-[0_0_6px_oklch(0.65_0.20_22_/_0.6)]" />
        Expired
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10.5px] font-semibold tracking-wide whitespace-nowrap bg-[oklch(0.70_0.15_160_/_0.10)] text-[oklch(0.82_0.15_160)] border-[oklch(0.70_0.15_160_/_0.25)]">
      <span className="size-1.5 rounded-full shrink-0 bg-[oklch(0.70_0.15_160)] shadow-[0_0_6px_oklch(0.70_0.15_160_/_0.7)]" />
      Active
    </span>
  );
};

const getTypeBadge = (type: string) => {
  if (type === 'PERCENTAGE') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] uppercase font-bold tracking-wider">
        <Percent className="size-3" />
        {type}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-bold tracking-wider">
      <Banknote className="size-3" />
      {type}
    </span>
  );
};

const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export function CouponsTable({ coupons, isLoading, onEdit, onDeleteConfirm }: CouponsTableProps) {
  if (isLoading) {
    return (
      <div className="w-full h-full p-4 md:p-6">
        {/* Desktop Skeleton Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-b-[oklch(1_0_0_/_0.055)] hover:bg-transparent">
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-20 bg-[oklch(1_0_0_/_0.05)]" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow
                  key={index}
                  className="border-b-[oklch(1_0_0_/_0.055)] hover:bg-transparent"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-4 w-full max-w-[120px] bg-[oklch(1_0_0_/_0.05)]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Skeleton Cards */}
        <div className="block md:hidden space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-[oklch(1_0_0/0.065)] bg-[oklch(1_0_0/0.02)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-28 bg-[oklch(1_0_0/0.06)]" />
                <Skeleton className="h-6 w-20 rounded-full bg-[oklch(1_0_0/0.06)]" />
              </div>
              <div className="space-y-1 py-1">
                <Skeleton className="h-4 w-36 bg-[oklch(1_0_0/0.06)]" />
                <Skeleton className="h-3 w-48 bg-[oklch(1_0_0/0.06)]" />
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[oklch(1_0_0/0.04)]">
                <Skeleton className="h-4 w-24 bg-[oklch(1_0_0/0.06)]" />
                <Skeleton className="h-5 w-16 bg-[oklch(1_0_0/0.06)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-20 text-[oklch(0.55_0_0)] bg-transparent rounded-lg border-none px-4 text-center">
        <Ticket className="h-10 w-10 md:h-12 md:w-12 mb-3 md:mb-4 opacity-30 text-[oklch(0.55_0_0)]" />
        <div className="text-[13px] font-medium tracking-wide">No coupons found.</div>
        <p className="text-xs mt-1 opacity-70">Try adjusting your search or filters.</p>
      </div>
    );
  }

  const thClass =
    'text-[oklch(0.55_0_0)] uppercase tracking-wider text-[10px] font-semibold h-10 border-b-[oklch(1_0_0_/_0.055)] px-4 whitespace-nowrap';
  const tdClass = 'py-3 px-4 text-[13px] text-[oklch(0.85_0_0)] font-medium whitespace-nowrap';
  const rowClass =
    'group transition-colors border-b-[oklch(1_0_0_/_0.055)] hover:bg-[oklch(1_0_0_/_0.04)]';

  return (
    <>
      {/* DESKTOP TABLE VIEW (Unchanged for md+) */}
      <div className="hidden md:block w-full h-full bg-transparent overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-[oklch(1_0_0_/_0.055)]">
              <TableHead className={cn(thClass, 'min-w-[160px]')}>
                <div className="flex items-center gap-1.5">
                  <Ticket className="size-3.5" /> Code & Value
                </div>
              </TableHead>
              <TableHead className={thClass}>
                <div className="flex items-center gap-1.5">
                  <Box className="size-3.5" /> Scope
                </div>
              </TableHead>
              <TableHead className={thClass}>
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" /> Validity
                </div>
              </TableHead>
              <TableHead className={thClass}>
                <div className="flex items-center gap-1.5">
                  <Users className="size-3.5" /> Usage
                </div>
              </TableHead>
              <TableHead className={thClass}>Status</TableHead>
              <TableHead className={cn(thClass, 'w-[80px] text-right')}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id} className={rowClass}>
                <TableCell className={tdClass}>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-[oklch(0.95_0_0)] tracking-wide">
                      {coupon.code}
                    </span>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(coupon.type)}
                      <span className="text-[12px] text-[oklch(0.7_0_0)] font-semibold">
                        {coupon.type === 'PERCENTAGE'
                          ? `${coupon.value}% OFF`
                          : `₹${coupon.value} OFF`}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className={tdClass}>
                  {coupon.applicableProducts && coupon.applicableProducts.length > 0 ? (
                    <span className="text-[12px] text-indigo-400 font-medium">
                      {coupon.applicableProducts.length} Product(s)
                    </span>
                  ) : (
                    <span className="text-[12px] text-[oklch(0.55_0_0)]">Store-wide</span>
                  )}
                  {coupon.minOrder ? (
                    <div className="text-[11px] text-[oklch(0.55_0_0)] mt-0.5">
                      Min: ₹{coupon.minOrder}
                    </div>
                  ) : null}
                </TableCell>

                <TableCell className={tdClass}>
                  <div className="flex flex-col gap-0.5 text-[11.5px] text-[oklch(0.7_0_0)]">
                    <span>From: {formatDate(coupon.validFrom)}</span>
                    <span>Until: {formatDate(coupon.validUntil)}</span>
                  </div>
                </TableCell>

                <TableCell className={tdClass}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[12px] text-[oklch(0.85_0_0)] font-semibold">
                      {coupon.usedCount} Used
                    </span>
                    {coupon.usageLimit ? (
                      <span className="text-[11px] text-[oklch(0.55_0_0)]">
                        Limit: {coupon.usageLimit}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[oklch(0.55_0_0)]">No limit</span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3">
                  {getStatusBadge(coupon.isActive, coupon.validUntil)}
                </TableCell>

                <TableCell className="px-4 py-3 text-right">
                  <CouponActions
                    coupon={coupon}
                    onEdit={onEdit}
                    onDeleteConfirm={onDeleteConfirm}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE RESPONSIVE CARDS VIEW (block md:hidden) */}
      <div className="block md:hidden p-3 sm:p-4 space-y-3">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={cn(
              'rounded-xl p-4 transition-all duration-300',
              'bg-gradient-to-b from-[oklch(0.14_0.005_260)] to-[oklch(0.12_0.005_260)]',
              'border border-[oklch(1_0_0/0.07)] hover:border-[oklch(1_0_0/0.14)]',
              'shadow-sm flex flex-col gap-3',
            )}
          >
            {/* Top row: Code + Type + Value + Status + Actions */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[oklch(1_0_0/0.05)]">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[oklch(0.95_0_0)] text-base">
                  {coupon.code}
                </span>
                {getTypeBadge(coupon.type)}
              </div>
              <div className="flex items-center gap-1.5">
                {getStatusBadge(coupon.isActive, coupon.validUntil)}
                <CouponActions coupon={coupon} onEdit={onEdit} onDeleteConfirm={onDeleteConfirm} />
              </div>
            </div>

            {/* Middle row: Discount Value & Scope */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-[oklch(0.5_0_0)] block font-semibold">
                  Discount Value
                </span>
                <span className="font-bold text-[oklch(0.98_0_0)] text-sm">
                  {coupon.type === 'PERCENTAGE' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-[oklch(0.5_0_0)] block font-semibold">
                  Applicable Scope
                </span>
                {coupon.applicableProducts && coupon.applicableProducts.length > 0 ? (
                  <span className="text-xs text-indigo-400 font-medium">
                    {coupon.applicableProducts.length} Product(s)
                  </span>
                ) : (
                  <span className="text-xs text-[oklch(0.7_0_0)]">Store-wide</span>
                )}
                {coupon.minOrder ? (
                  <span className="text-[10px] text-[oklch(0.55_0_0)] block">
                    Min: ₹{coupon.minOrder}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Bottom row: Usage & Validity */}
            <div className="flex items-center justify-between pt-2 border-t border-[oklch(1_0_0/0.05)] text-[11px] text-[oklch(0.6_0_0)]">
              <div>
                <span className="text-[10px] uppercase text-[oklch(0.5_0_0)] block font-semibold">
                  Validity
                </span>
                <span>
                  {formatDate(coupon.validFrom)} – {formatDate(coupon.validUntil)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-[oklch(0.5_0_0)] block font-semibold">
                  Usage
                </span>
                <span className="font-semibold text-[oklch(0.85_0_0)]">
                  {coupon.usedCount} Used{' '}
                  {coupon.usageLimit ? `/ ${coupon.usageLimit}` : '(No limit)'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
