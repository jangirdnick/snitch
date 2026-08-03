import { KpiCard } from '../../components/shared/KpiCard';
import { SalesChart } from './SalesChart';
import { OrderOverview } from './OrderOverview';
import { RecentDeliveredTable } from './RecentDeliveredTable';
import { useDashboardAnalytics, useRecentDeliveredOrders } from '../hook/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';
import { IndianRupee, PackageOpen, ShoppingCart, XOctagon } from 'lucide-react';

export function AnalyticsDashboard() {
  const { data: dashboard, isLoading: dashLoading } = useDashboardAnalytics();
  const { data: recentOrders, isLoading: ordersLoading, setPage } = useRecentDeliveredOrders();

  if (dashLoading || !dashboard) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[120px] rounded-xl" />
          <Skeleton className="h-[120px] rounded-xl" />
          <Skeleton className="h-[120px] rounded-xl" />
          <Skeleton className="h-[120px] rounded-xl" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Skeleton className="h-[400px] lg:col-span-3 rounded-xl" />
          <Skeleton className="h-[400px] lg:col-span-2 rounded-xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <KpiCard
          title="Total Sales"
          metric={dashboard.kpi.totalSales}
          icon={IndianRupee}
          formatValue={(val) => `₹${val.toLocaleString()}`}
          index={0}
        />
        <KpiCard
          title="Products Sold"
          metric={dashboard.kpi.productsSold}
          icon={PackageOpen}
          formatValue={(val) => val.toLocaleString()}
          index={1}
        />
        <KpiCard
          title="Today's Orders"
          metric={dashboard.kpi.todaysOrders}
          icon={ShoppingCart}
          index={2}
        />
        <KpiCard
          title="Cancelled Orders"
          metric={dashboard.kpi.cancelledOrders}
          icon={XOctagon}
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <SalesChart data={dashboard.salesChart} />
        <OrderOverview data={dashboard.orderOverview} />
      </div>

      {recentOrders ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
          <RecentDeliveredTable data={recentOrders} onPageChange={setPage} hfull={false} />
        </div>
      ) : ordersLoading ? (
        <Skeleton className="h-[400px] w-full rounded-xl" />
      ) : null}
    </div>
  );
}
