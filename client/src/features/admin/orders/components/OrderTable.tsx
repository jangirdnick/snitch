import { useState } from 'react';
import type { Order } from '@snitch/types';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from './OrderStatusBadge';
import {
  MoreHorizontal,
  FileText,
  Truck,
  Edit,
  User,
  Calendar,
  CreditCard,
  Box,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { OrderTrackingDialog } from './OrderTrackingDialog';
import { UpdateOrderStatusDialog } from './UpdateOrderStatusDialog';
import { OrderDetailsSheet } from './OrderDetailsSheet';

interface OrderTableProps {
  orders: Order[];
  isLoading?: boolean;
  onUpdateStatus: (
    id: string,
    payload: { status: Order['status']; note?: string },
  ) => Promise<boolean>;
  onUpdateTracking: (
    id: string,
    payload: { trackingId: string; carrier: string },
  ) => Promise<boolean>;
}

const getInitials = (first: string, last?: string) => {
  return `${first.charAt(0)}${last ? last.charAt(0) : ''}`.toUpperCase();
};

export function OrderTable({
  orders,
  isLoading,
  onUpdateStatus,
  onUpdateTracking,
}: OrderTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeDialog, setActiveDialog] = useState<'status' | 'tracking' | 'details' | null>(null);

  if (isLoading) {
    return (
      <div className="w-full h-full p-4 md:p-6">
        {/* Desktop Skeleton Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-b-[oklch(1_0_0/0.055)] hover:bg-transparent">
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-20 bg-[oklch(1_0_0/0.05)]" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRow
                  key={index}
                  className="border-b-[oklch(1_0_0/0.055)] hover:bg-transparent"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-4 w-full max-w-30 bg-[oklch(1_0_0/0.05)]" />
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
                <Skeleton className="h-5 w-24 bg-[oklch(1_0_0/0.06)]" />
                <Skeleton className="h-6 w-20 rounded-full bg-[oklch(1_0_0/0.06)]" />
              </div>
              <div className="flex items-center gap-3 py-1">
                <Skeleton className="size-9 rounded-full bg-[oklch(1_0_0/0.06)]" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-32 bg-[oklch(1_0_0/0.06)]" />
                  <Skeleton className="h-3 w-40 bg-[oklch(1_0_0/0.06)]" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[oklch(1_0_0/0.04)]">
                <Skeleton className="h-4 w-20 bg-[oklch(1_0_0/0.06)]" />
                <Skeleton className="h-5 w-16 bg-[oklch(1_0_0/0.06)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-20 text-[oklch(0.5_0_0)] bg-transparent rounded-lg border-none px-4 text-center">
        <FileText className="h-10 w-10 md:h-12 md:w-12 mb-3 md:mb-4 opacity-30" />
        <p className="text-sm font-medium tracking-wide">No orders found</p>
        <p className="text-xs mt-1 opacity-70">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  const thClass =
    'text-[oklch(0.55_0_0)] uppercase tracking-wider text-[10px] font-semibold h-10 border-b-[oklch(1_0_0/0.055)] px-4 whitespace-nowrap';
  const tdClass = 'py-3 px-4 text-[13px] text-[oklch(0.85_0_0)] font-medium whitespace-nowrap';
  const rowClass =
    'group transition-colors border-b-[oklch(1_0_0/0.055)] hover:bg-[oklch(1_0_0/0.04)]';

  return (
    <>
      {/* DESKTOP TABLE VIEW (Unchanged for md+) */}
      <div className="hidden md:block w-full h-full bg-transparent overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-[oklch(1_0_0/0.055)]">
              <TableHead className={cn(thClass, 'min-w-40')}>
                <div className="flex items-center gap-1.5">
                  <FileText className="size-3.5" /> Order Details
                </div>
              </TableHead>
              <TableHead className={cn(thClass, 'min-w-50')}>
                <div className="flex items-center gap-1.5">
                  <User className="size-3.5" /> Customer
                </div>
              </TableHead>
              <TableHead className={thClass}>
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" /> Date & Time
                </div>
              </TableHead>
              <TableHead className={cn(thClass, 'text-right')}>
                <div className="flex items-center justify-end gap-1.5">
                  <CreditCard className="size-3.5" /> Amount
                </div>
              </TableHead>
              <TableHead className={thClass}>Status</TableHead>
              <TableHead className={cn(thClass, 'w-20 text-right')}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const userFirstName =
                typeof order.user === 'object' ? order.user.firstName : 'Unknown';
              const userLastName = typeof order.user === 'object' ? order.user.lastName : '';
              const userEmail = typeof order.user === 'object' ? order.user.email : '';

              return (
                <TableRow key={order.id} className={rowClass}>
                  {/* ORDER DETAILS */}
                  <TableCell className={tdClass}>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono font-bold text-[oklch(0.95_0_0)] text-sm tracking-tight">
                        {order.orderNumber}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-[oklch(0.55_0_0)] font-medium">
                        <Box className="size-3" />
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </div>
                    </div>
                  </TableCell>

                  {/* CUSTOMER */}
                  <TableCell className={tdClass}>
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-[oklch(1_0_0/0.08)] border border-[oklch(1_0_0/0.1)] flex items-center justify-center text-[oklch(0.8_0_0)] text-xs font-bold tracking-widest shrink-0">
                        {getInitials(userFirstName, userLastName)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-[oklch(0.95_0_0)] truncate max-w-37.5">
                          {userFirstName} {userLastName}
                        </span>
                        <span className="text-[11px] text-[oklch(0.6_0_0)] mt-0.5 truncate max-w-37.5">
                          {userEmail}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* DATE & TIME */}
                  <TableCell className={tdClass}>
                    <div className="flex flex-col gap-1">
                      <span className="text-[12.5px] text-[oklch(0.85_0_0)]">
                        {new Intl.DateTimeFormat('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }).format(new Date(order.createdAt))}
                      </span>
                      <span className="text-[11px] text-[oklch(0.6_0_0)] font-medium">
                        {new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
                          new Date(order.createdAt),
                        )}
                      </span>
                    </div>
                  </TableCell>

                  {/* AMOUNT */}
                  <TableCell className={cn(tdClass, 'text-right')}>
                    <span className="font-bold text-[oklch(0.95_0_0)] text-[14px]">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                      }).format(order.netAmount)}
                    </span>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-[oklch(0.6_0_0)] hover:text-[oklch(0.95_0_0)] hover:bg-[oklch(1_0_0/0.06)]"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[oklch(0.15_0.01_260)] border-[oklch(0.25_0.02_260)] text-[oklch(0.9_0_0)] min-w-40"
                      >
                        <DropdownMenuLabel className="text-[oklch(0.55_0_0)] text-xs uppercase tracking-wider">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedOrder(order);
                            setActiveDialog('details');
                          }}
                          className="cursor-pointer hover:bg-[oklch(0.2_0.02_260)] focus:bg-[oklch(0.2_0.02_260)]"
                        >
                          <FileText className="mr-2 h-4 w-4 text-[oklch(0.6_0_0)]" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[oklch(0.25_0.02_260)]" />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedOrder(order);
                            setActiveDialog('status');
                          }}
                          className="cursor-pointer hover:bg-[oklch(0.2_0.02_260)] focus:bg-[oklch(0.2_0.02_260)]"
                        >
                          <Edit className="mr-2 h-4 w-4 text-[oklch(0.6_0_0)]" />
                          Update Status
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedOrder(order);
                            setActiveDialog('tracking');
                          }}
                          className="cursor-pointer hover:bg-[oklch(0.2_0.02_260)] focus:bg-[oklch(0.2_0.02_260)]"
                        >
                          <Truck className="mr-2 h-4 w-4 text-[oklch(0.6_0_0)]" />
                          Manage Tracking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE RESPONSIVE CARDS VIEW (block md:hidden) */}
      <div className="block md:hidden p-3 sm:p-4 space-y-3">
        {orders.map((order) => {
          const userFirstName = typeof order.user === 'object' ? order.user.firstName : 'Unknown';
          const userLastName = typeof order.user === 'object' ? order.user.lastName : '';
          const userEmail = typeof order.user === 'object' ? order.user.email : '';

          return (
            <div
              key={order.id}
              className={cn(
                'rounded-xl p-4 transition-all duration-300',
                'bg-gradient-to-b from-[oklch(0.14_0.005_260)] to-[oklch(0.12_0.005_260)]',
                'border border-[oklch(1_0_0/0.07)] hover:border-[oklch(1_0_0/0.14)]',
                'shadow-sm flex flex-col gap-3',
              )}
            >
              {/* Header: Order Number + Status + Actions Menu */}
              <div className="flex items-center justify-between pb-2 border-b border-[oklch(1_0_0/0.05)]">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[oklch(0.95_0_0)] text-sm">
                    {order.orderNumber}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[oklch(1_0_0/0.06)] text-[oklch(0.7_0_0)] flex items-center gap-1">
                    <Box className="size-3" />
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <OrderStatusBadge status={order.status} className="scale-90 origin-right" />
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
                      className="bg-[oklch(0.15_0.01_260)] border-[oklch(0.25_0.02_260)] text-[oklch(0.9_0_0)] min-w-44"
                    >
                      <DropdownMenuLabel className="text-[oklch(0.55_0_0)] text-xs uppercase tracking-wider">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedOrder(order);
                          setActiveDialog('details');
                        }}
                        className="cursor-pointer hover:bg-[oklch(0.2_0.02_260)] focus:bg-[oklch(0.2_0.02_260)] py-2.5"
                      >
                        <FileText className="mr-2 h-4 w-4 text-[oklch(0.6_0_0)]" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[oklch(0.25_0.02_260)]" />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedOrder(order);
                          setActiveDialog('status');
                        }}
                        className="cursor-pointer hover:bg-[oklch(0.2_0.02_260)] focus:bg-[oklch(0.2_0.02_260)] py-2.5"
                      >
                        <Edit className="mr-2 h-4 w-4 text-[oklch(0.6_0_0)]" />
                        Update Status
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedOrder(order);
                          setActiveDialog('tracking');
                        }}
                        className="cursor-pointer hover:bg-[oklch(0.2_0.02_260)] focus:bg-[oklch(0.2_0.02_260)] py-2.5"
                      >
                        <Truck className="mr-2 h-4 w-4 text-[oklch(0.6_0_0)]" />
                        Manage Tracking
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-[oklch(1_0_0/0.08)] border border-[oklch(1_0_0/0.1)] flex items-center justify-center text-[oklch(0.85_0_0)] text-xs font-bold tracking-widest shrink-0">
                  {getInitials(userFirstName, userLastName)}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-semibold text-[oklch(0.95_0_0)] text-sm truncate">
                    {userFirstName} {userLastName}
                  </span>
                  <span className="text-[11px] text-[oklch(0.6_0_0)] truncate">{userEmail}</span>
                </div>
              </div>

              {/* Date & Net Amount */}
              <div className="flex items-center justify-between pt-2 border-t border-[oklch(1_0_0/0.05)]">
                <div className="flex flex-col text-[11px] text-[oklch(0.6_0_0)]">
                  <span>
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }).format(new Date(order.createdAt))}
                  </span>
                  <span className="text-[10px] text-[oklch(0.5_0_0)]">
                    {new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
                      new Date(order.createdAt),
                    )}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-[oklch(0.5_0_0)] block font-semibold">
                    Net Amount
                  </span>
                  <span className="font-bold text-[oklch(0.98_0_0)] text-base">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    }).format(order.netAmount)}
                  </span>
                </div>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedOrder(order);
                    setActiveDialog('details');
                  }}
                  className="h-9 bg-[oklch(1_0_0/0.04)] border-[oklch(1_0_0/0.08)] text-[oklch(0.85_0_0)] hover:bg-[oklch(1_0_0/0.08)] text-xs font-medium rounded-lg active:scale-98"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-[oklch(0.6_0_0)]" />
                  Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedOrder(order);
                    setActiveDialog('status');
                  }}
                  className="h-9 bg-[oklch(1_0_0/0.04)] border-[oklch(1_0_0/0.08)] text-[oklch(0.85_0_0)] hover:bg-[oklch(1_0_0/0.08)] text-xs font-medium rounded-lg active:scale-98"
                >
                  <Edit className="w-3.5 h-3.5 mr-1.5 text-[oklch(0.6_0_0)]" />
                  Status
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedOrder && (
        <>
          <OrderTrackingDialog
            isOpen={activeDialog === 'tracking'}
            onClose={() => setActiveDialog(null)}
            orderNumber={selectedOrder.orderNumber}
            defaultTrackingId={selectedOrder.shipping?.trackingId || ''}
            defaultCarrier={selectedOrder.shipping?.carrier || ''}
            onConfirm={async (payload) => {
              const success = await onUpdateTracking(selectedOrder.id, payload);
              if (success) setActiveDialog(null);
            }}
          />
          <UpdateOrderStatusDialog
            isOpen={activeDialog === 'status'}
            onClose={() => setActiveDialog(null)}
            orderNumber={selectedOrder.orderNumber}
            currentStatus={selectedOrder.status}
            onConfirm={async (payload) => {
              if (!payload.status) return;
              const success = await onUpdateStatus(selectedOrder.id, {
                status: payload.status as Order['status'],
                note: payload.note,
              });
              if (success) setActiveDialog(null);
            }}
          />
          <OrderDetailsSheet
            isOpen={activeDialog === 'details'}
            onClose={() => setActiveDialog(null)}
            order={selectedOrder}
          />
        </>
      )}
    </>
  );
}
