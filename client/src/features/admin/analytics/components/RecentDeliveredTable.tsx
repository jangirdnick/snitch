import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { PaginatedOrders } from '@snitch/types';
import dayjs from 'dayjs';
import { ArrowRight, PackageCheck, ReceiptText } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

interface RecentDeliveredTableProps {
  data: PaginatedOrders;
  onPageChange: (page: number) => void;
  hfull: boolean;
  title?: string;
  description?: string;
}

const getPaymentBadgeClass = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'paid':
      return 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/15 dark:text-green-400 dark:hover:bg-green-500/25 border-transparent';
    case 'pending':
      return 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:hover:bg-amber-500/25 border-transparent';
    case 'failed':
      return 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500/25 border-transparent';
    case 'refunded':
      return 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-500/15 dark:text-zinc-400 dark:hover:bg-zinc-500/25 border-transparent';
    default:
      return 'bg-secondary text-secondary-foreground border-transparent';
  }
};

export function RecentDeliveredTable({
  data,
  onPageChange,
  hfull,
  title,
  description,
}: RecentDeliveredTableProps) {
  return (
    <Card
      className={`col-span-1 ${hfull ? '' : 'lg:col-span-5 lg:h-[40%] 2xl:h-[73%]'} overflow-y-scroll justify-between`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title || 'Recent Delivered Orders'}</CardTitle>
            <CardDescription>
              {description || 'Latest successfully delivered orders across the platform'}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link className="flex items-center gap-2" to="/admin/orders?status=delivered">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* DESKTOP TABLE VIEW (Unchanged for md+) */}
        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Delivered Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    No recent delivered orders.
                  </TableCell>
                </TableRow>
              ) : (
                data.items.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <PackageCheck className="h-4 w-4 text-green-500" />
                        {order.orderNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.user && typeof order.user === 'object' && 'firstName' in order.user
                        ? `${order.user.firstName} ${order.user.lastName}`
                        : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="truncate max-w-[150px]">
                          {order.items?.[0]?.title || 'Unknown Item'}
                        </span>
                        {order.items && order.items.length > 1 && (
                          <span className="text-xs text-muted-foreground">
                            +{order.items.length - 1} more items
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-[oklch(0.55_0.22_270)]">
                      ₹{order.netAmount || 0}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize ${getPaymentBadgeClass(order.payment?.status)}`}
                      >
                        {order.payment?.status || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.shipping?.deliveredAt
                        ? dayjs(order.shipping.deliveredAt).format('MMM D, YYYY')
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/orders`}>
                          <ReceiptText className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* MOBILE RESPONSIVE DELIVERED CARDS VIEW (block md:hidden) */}
        <div className="block md:hidden space-y-3">
          {data.items.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No recent delivered orders.
            </div>
          ) : (
            data.items.map((order) => (
              <div
                key={order.id}
                className="rounded-xl p-3.5 sm:p-4 bg-[oklch(1_0_0/0.02)] border border-[oklch(1_0_0/0.07)] space-y-2.5 shadow-sm"
              >
                {/* Header: Order Number + Payment Badge */}
                <div className="flex items-center justify-between pb-2 border-b border-[oklch(1_0_0/0.05)]">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="font-mono font-bold text-[oklch(0.95_0_0)] text-sm">
                      {order.orderNumber}
                    </span>
                  </div>
                  <Badge
                    className={`capitalize text-[10px] px-2 py-0.5 ${getPaymentBadgeClass(order.payment?.status)}`}
                  >
                    {order.payment?.status || 'Unknown'}
                  </Badge>
                </div>

                {/* Body: Customer + Products */}
                <div className="flex items-start justify-between text-xs gap-2">
                  <div>
                    <span className="text-[10px] uppercase text-[oklch(0.5_0_0)] block font-semibold">
                      Customer
                    </span>
                    <span className="font-semibold text-[oklch(0.9_0_0)]">
                      {order.user && typeof order.user === 'object' && 'firstName' in order.user
                        ? `${order.user.firstName} ${order.user.lastName}`
                        : 'Unknown'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-[oklch(0.5_0_0)] block font-semibold">
                      Total
                    </span>
                    <span className="font-bold text-emerald-400 text-sm">
                      ₹{order.netAmount || 0}
                    </span>
                  </div>
                </div>

                {/* Product Summary & Date */}
                <div className="flex items-center justify-between pt-2 border-t border-[oklch(1_0_0/0.05)] text-[11px] text-[oklch(0.6_0_0)]">
                  <div className="truncate max-w-[180px]">
                    <span className="truncate block text-[oklch(0.8_0_0)] font-medium">
                      {order.items?.[0]?.title || 'Unknown Item'}
                    </span>
                    {order.items && order.items.length > 1 && (
                      <span className="text-[10px] text-[oklch(0.5_0_0)]">
                        +{order.items.length - 1} more items
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-[oklch(0.5_0_0)] block">Delivered</span>
                    <span>
                      {order.shipping?.deliveredAt
                        ? dayjs(order.shipping.deliveredAt).format('MMM D, YYYY')
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {data.totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent className="flex-wrap justify-center sm:justify-end gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (data.page > 1) onPageChange(data.page - 1);
                    }}
                    className={data.page <= 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                {[...Array(data.totalPages)].map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      href="#"
                      isActive={data.page === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (data.page < data.totalPages) onPageChange(data.page + 1);
                    }}
                    className={data.page >= data.totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
