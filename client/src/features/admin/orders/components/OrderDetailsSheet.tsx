import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import type { Order } from '@snitch/types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, MapPin, Package, CreditCard, Clock, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderDetailsSheetProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const sectionHeaderClass =
  'flex items-center gap-2 text-xs font-bold text-[oklch(0.6_0.02_260)] uppercase tracking-widest mb-4';
const cardClass =
  'bg-linear-to-b from-[oklch(1_0_0/0.03)] to-[oklch(1_0_0/0.01)] p-5 rounded-xl border border-[oklch(1_0_0/0.05)] shadow-sm';

export function OrderDetailsSheet({ order, isOpen, onClose }: OrderDetailsSheetProps) {
  if (!order) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl! bg-linear-to-b from-[oklch(0.13_0.01_260)] to-[oklch(0.11_0.01_260)] border-l-[oklch(1_0_0/0.1)] text-[oklch(0.95_0_0)] p-0 shadow-[0_0_40px_oklch(0_0_0/0.5)]">
        <ScrollArea className="h-full">
          <div className="p-6 md:p-8">
            <SheetHeader className="mb-8 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <SheetTitle className="text-2xl font-bold tracking-tight text-[oklch(0.95_0_0)]">
                    Order{' '}
                    <span className="font-mono text-[oklch(0.7_0.15_260)]">
                      {order.orderNumber}
                    </span>
                  </SheetTitle>
                  <SheetDescription className="text-[oklch(0.6_0_0)] font-medium text-sm">
                    Placed on{' '}
                    <span className="text-[oklch(0.8_0_0)]">
                      {new Intl.DateTimeFormat('en-US', {
                        dateStyle: 'long',
                        timeStyle: 'short',
                      }).format(new Date(order.createdAt))}
                    </span>
                  </SheetDescription>
                </div>
                <OrderStatusBadge
                  status={order.status}
                  className="scale-110 origin-top-right mt-1"
                />
              </div>
            </SheetHeader>

            <div className="space-y-8">
              {/* Customer & Shipping */}
              <section>
                <h3 className={sectionHeaderClass}>
                  <User className="size-4 text-[oklch(0.7_0.15_260)]" />
                  Customer & Shipping
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={cardClass}>
                    <p className="font-semibold text-[oklch(0.9_0_0)] mb-1 text-[15px]">
                      {typeof order.user === 'object'
                        ? `${order.user.firstName} ${order.user.lastName || ''}`
                        : 'Unknown'}
                    </p>
                    <p className="text-[oklch(0.6_0_0)] text-sm mb-3">
                      {typeof order.user === 'object' ? order.user.email : ''}
                    </p>
                    <div className="inline-flex items-center gap-2 bg-[oklch(1_0_0/0.05)] px-2.5 py-1 rounded-md text-xs font-medium text-[oklch(0.7_0_0)]">
                      <span>📞</span> {order.shipping.address.phone}
                    </div>
                  </div>
                  <div className={cardClass}>
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="size-4 text-[oklch(0.5_0_0)] mt-0.5 shrink-0" />
                      <p className="font-medium text-[oklch(0.9_0_0)] text-sm leading-relaxed">
                        {order.shipping.address.street}
                        <br />
                        {order.shipping.address.city}, {order.shipping.address.state}
                        <br />
                        {order.shipping.address.zipCode}
                        <br />
                        <span className="text-[oklch(0.6_0_0)]">
                          {order.shipping.address.country}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Items */}
              <section>
                <h3 className={sectionHeaderClass}>
                  <Package className="size-4 text-[oklch(0.7_0.15_260)]" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-[oklch(1_0_0/0.02)] hover:bg-[oklch(1_0_0/0.04)] transition-colors p-3.5 rounded-xl border border-[oklch(1_0_0/0.05)]"
                    >
                      <div className="h-16 w-16 bg-[oklch(1_0_0/0.05)] rounded-lg overflow-hidden shrink-0 border border-[oklch(1_0_0/0.1)] flex items-center justify-center">
                        {item.primaryImage ? (
                          <img
                            src={item.primaryImage}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Box className="size-6 text-[oklch(1_0_0/0.2)]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[oklch(0.95_0_0)] truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[oklch(0.5_0_0)] mt-1 font-mono bg-[oklch(1_0_0/0.05)] inline-block px-1.5 rounded-sm">
                          {item.sku}
                        </p>
                        {(item.size || item.color) && (
                          <p className="text-xs text-[oklch(0.6_0_0)] mt-1.5 flex items-center gap-2">
                            {item.size && (
                              <span className="bg-[oklch(1_0_0/0.05)] px-2 py-0.5 rounded-full">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="bg-[oklch(1_0_0/0.05)] px-2 py-0.5 rounded-full">
                                Color: {item.color}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-bold text-[oklch(0.95_0_0)] text-[15px]">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0,
                          }).format(item.price)}
                        </p>
                        <p className="text-[oklch(0.6_0_0)] text-xs mt-1 font-medium">
                          Qty: <span className="text-[oklch(0.9_0_0)]">{item.quantity}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Payment & Summary */}
              <section>
                <h3 className={sectionHeaderClass}>
                  <CreditCard className="size-4 text-[oklch(0.7_0.15_260)]" />
                  Payment Summary
                </h3>
                <div className={cardClass}>
                  <div className="flex justify-between items-center pb-4 mb-4 border-b border-[oklch(1_0_0/0.06)]">
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <p className="text-[oklch(0.5_0_0)] text-[11px] uppercase tracking-wider font-bold mb-1">
                          Method
                        </p>
                        <p className="uppercase text-[oklch(0.95_0_0)] font-semibold">
                          {order.payment.method}
                        </p>
                      </div>
                      <div>
                        <p className="text-[oklch(0.5_0_0)] text-[11px] uppercase tracking-wider font-bold mb-1">
                          Status
                        </p>
                        <p
                          className={cn(
                            'capitalize font-semibold',
                            order.payment.status === 'paid'
                              ? 'text-emerald-400'
                              : 'text-[oklch(0.95_0_0)]',
                          )}
                        >
                          {order.payment.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-[oklch(0.7_0_0)] font-medium">
                      <span>Subtotal</span>
                      <span className="text-[oklch(0.9_0_0)]">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        }).format(order.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-[oklch(0.7_0_0)] font-medium">
                      <span>Shipping</span>
                      <span className="text-[oklch(0.9_0_0)]">
                        {order.shippingFee > 0
                          ? new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                            }).format(order.shippingFee)
                          : 'Free'}
                      </span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between text-sm font-medium text-emerald-400">
                        <span>Discount</span>
                        <span>
                          -
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                          }).format(order.discountAmount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-base font-bold text-[oklch(0.95_0_0)] pt-4 mt-2 border-t border-[oklch(1_0_0/0.06)]">
                      <span>Net Amount</span>
                      <span className="text-xl">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 0,
                        }).format(order.netAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Timeline */}
              <section>
                <h3 className={sectionHeaderClass}>
                  <Clock className="size-4 text-[oklch(0.7_0.15_260)]" />
                  Order Timeline
                </h3>
                <div className={cardClass}>
                  <div className="space-y-0">
                    {order.timeline.map((event, idx) => (
                      <div key={idx} className="relative pl-8 py-3">
                        {idx !== order.timeline.length - 1 && (
                          <div className="absolute left-[15px] top-6 bottom-[-1rem] w-px bg-linear-to-b from-[oklch(1_0_0/0.1)] to-[oklch(1_0_0/0.02)]" />
                        )}
                        <div className="absolute left-2.5 top-4 h-[11px] w-[11px] rounded-full bg-[oklch(0.7_0.15_260)] ring-4 ring-[oklch(0.12_0.01_260)] shadow-[0_0_8px_oklch(0.7_0.15_260/0.6)]" />
                        <div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold capitalize text-[oklch(0.95_0_0)]">
                              {event.status}
                            </p>
                            <p className="text-xs font-medium text-[oklch(0.5_0_0)]">
                              {new Intl.DateTimeFormat('en-US', {
                                dateStyle: 'medium',
                              }).format(new Date(event.timestamp))}
                            </p>
                          </div>
                          <p className="text-xs text-[oklch(0.6_0_0)] mt-0.5">
                            {new Intl.DateTimeFormat('en-US', {
                              timeStyle: 'short',
                            }).format(new Date(event.timestamp))}
                          </p>
                          {event.note && (
                            <div className="mt-3 bg-[oklch(1_0_0/0.03)] p-3 rounded-lg border border-[oklch(1_0_0/0.05)] relative">
                              <div className="absolute -top-2 left-4 w-3 h-3 bg-[oklch(1_0_0/0.03)] rotate-45 border-l border-t border-[oklch(1_0_0/0.05)]" />
                              <p className="text-[13px] text-[oklch(0.7_0_0)] relative z-10 leading-relaxed">
                                {event.note}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
