import { AnalyticsDashboard } from '@/features/admin/analytics/components/AnalyticsDashboard';
import { PageHeader } from '@/components/ui/page-header';

export default function AnalyticsPage() {
  return (
    <div className="flex-1 h-full overflow-y-auto space-y-4 md:space-y-6 pb-22 lg:pb-4 sm:p-2 lg:p-0">
      <PageHeader
        title="Sales & Revenue Analytics"
        description="Deep financial trends, monthly revenue breakdown, and order distribution stats."
      />
      <AnalyticsDashboard />
    </div>
  );
}
