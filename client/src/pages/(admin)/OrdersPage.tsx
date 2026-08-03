import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderTableSection } from '@/features/admin/orders/components/OrderTableSection';
import { cn } from '@/lib/utils';
import { ShoppingBag, Clock } from 'lucide-react';

export function OrdersPage() {
  return (
    <>
      <div className="flex-1 flex flex-col justify-between h-full overflow-y-auto space-y-4 md:space-y-6 pb-20 lg:pb-4 sm:p-2 lg:p-0">
        <PageHeader
          title="Orders"
          description="Manage customer orders, track shipping, and update statuses."
        />

        <Tabs defaultValue="all" className="w-full space-y-4 md:space-y-2 flex-1 flex flex-col">
          <div className="w-full flex justify-end md:-mt-16 md:z-[99]">
            <TabsList className="bg-[oklch(0.12_0.01_260)] grid grid-cols-2 gap-2 w-full md:w-fit">
              <TabsTrigger
                value="all"
                className={cn(
                  'group relative shrink-0 overflow-hidden rounded-xl md:w-fit! h-11 sm:h-10 px-3.5 sm:px-4',
                  'bg-[oklch(1_0_0_/_0.03)] border-[oklch(1_0_0_/_0.1)] text-[oklch(0.85_0_0)]',
                  'hover:bg-[oklch(1_0_0_/_0.08)] hover:text-[oklch(0.95_0_0)]',
                  'font-medium text-[12.5px] sm:text-[13px] tracking-wide',
                  'transition-all duration-300 ease-in-out active:scale-[0.98]',
                )}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                All Orders
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className={cn(
                  'group relative shrink-0 overflow-hidden rounded-xl md:w-fit! h-11 sm:h-10 px-3.5 sm:px-4',
                  'bg-orange-800 text-[oklch(0.98_0_0)] hover:bg-orange-700',
                  'font-semibold text-[12.5px] sm:text-[13px] tracking-wide',
                  'shadow-[0_2px_12px_oklch(1_0_0_/0.12)] hover:shadow-[0_6px_20px_oklch(1_0_0_/0.22)]',
                  'transition-all duration-300 ease-in-out active:scale-[0.98]',
                  'focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                )}
              >
                <Clock className="w-4 h-4 mr-2" />
                New Orders
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0 flex-1 flex flex-col min-h-0">
            <OrderTableSection />
          </TabsContent>

          <TabsContent value="new" className="mt-0 flex-1 flex flex-col min-h-0">
            <OrderTableSection initialStatus="new" />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
