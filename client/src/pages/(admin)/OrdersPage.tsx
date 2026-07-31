import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderTableSection } from '@/features/admin/orders/components/OrderTableSection';
import { cn } from '@/lib/utils';
import { ShoppingBag, Clock } from 'lucide-react';

export function OrdersPage() {
  return (
    <>
      <div className="space-y-2  md:space-y-6">
        <PageHeader
          title="Orders"
          description="Manage customer orders, track shipping, and update statuses."
        />

        <Tabs defaultValue="all" className="w-full h-full space-y-2 ">
          <div className="w-full flex items-center md:justify-end max-md:px-2.5">
            <TabsList className=" bg-[oklch(0.12_0.01_260)] border border-[oklch(0.2_0.02_260)] p-1 gap-2">
              <TabsTrigger
                value="all"
                className={cn(
                  'group relative shrink-0 overflow-hidden rounded-xl w-fit! h-10 px-3.5 sm:px-4',
                  'bg-[oklch(1_0_0_/_0.03)] border-[oklch(1_0_0_/_0.1)] text-[oklch(0.85_0_0)]',
                  'hover:bg-[oklch(1_0_0_/_0.08)] hover:text-[oklch(0.95_0_0)]',
                  'font-medium text-[12px] sm:text-[12.5px] tracking-wide',
                  'transition-all duration-300 ease-in-out active:scale-[0.98]',
                )}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                All Orders
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className={cn(
                  'group relative shrink-0 overflow-hidden rounded-xl w-fit! h-10 px-3.5 sm:px-4',
                  'bg-orange-800 text-[oklch(0.98_0_0)] hover:bg-orange-700',
                  'font-semibold text-[12px] sm:text-[12.5px] tracking-wide',
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

          <TabsContent value="all" className="">
            <OrderTableSection />
          </TabsContent>

          <TabsContent value="new" className="">
            <OrderTableSection initialStatus="new" />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
