import { useDashboardOverview } from '../hook/useDashboardOverview';
import { KpiCard } from '../../components/shared/KpiCard';
import { RecentDeliveredTable } from '../../analytics/components/RecentDeliveredTable';
import { LowStockProductsWidget } from './LowStockProductsWidget';
import { RecentCustomersWidget } from './RecentCustomersWidget';
import { RecentReviewsWidget } from './RecentReviewsWidget';
import { CouponSummaryWidget } from './CouponSummaryWidget';
import { QuickActions } from './QuickActions';
import { IndianRupee, ShoppingBag, Users, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function DashboardOverview() {
  const { data, loading, error } = useDashboardOverview();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[400px]">
          <Skeleton className="col-span-2 h-full rounded-xl" />
          <Skeleton className="col-span-1 h-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Dashboard</AlertTitle>
        <AlertDescription>{error || 'An unexpected error occurred.'}</AlertDescription>
      </Alert>
    );
  }

  const { metrics, lowStockProducts, recentCustomers, recentReviews, couponSummary } = data;

  return (
    <div className="space-y-6 flex-1 overflow-y-auto">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          index={0}
          title="Total Revenue"
          metric={metrics.totalRevenue}
          icon={IndianRupee}
          formatValue={(val) => `₹${val.toLocaleString()}`}
        />
        <KpiCard
          index={1}
          title="Total Orders"
          metric={metrics.totalOrders}
          icon={ShoppingBag}
          formatValue={(val) => val.toLocaleString()}
        />
        <KpiCard
          index={2}
          title="Active Customers"
          metric={metrics.activeCustomers}
          icon={Users}
          formatValue={(val) => val.toLocaleString()}
        />
        <KpiCard
          index={3}
          title="Total Products"
          metric={metrics.totalProducts}
          icon={Package}
          formatValue={(val) => val.toLocaleString()}
        />
      </div>

      {/* Row 2: Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="col-span-1 lg:col-span-5">
          {/* Reusing Recent Delivered Table but wrapping it for overview.
              We'll use standard pagination internally. */}
          <RecentDeliveredTable
            title="Recent Orders"
            description="Latest orders placed on the platform"
            data={{
              items: data.recentOrders,
              total: data.recentOrders.length,
              page: 1,
              limit: 5,
              totalPages: 1,
            }}
            onPageChange={() => {}}
            hfull={true}
          />
        </div>
        <div className="col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Row 3: Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LowStockProductsWidget products={lowStockProducts} />
        <RecentCustomersWidget customers={recentCustomers} />
        <CouponSummaryWidget summary={couponSummary} />
        <RecentReviewsWidget reviews={recentReviews} />
      </div>
    </div>
  );
}
