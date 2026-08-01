import { AnalyticsDashboard } from '@/features/admin/analytics/components/AnalyticsDashboard';
import { PageHeader } from '@/components/ui/page-header';

export default function AnalyticsPage() {
  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0 bg-[oklch(0.04_0.005_260)]">
      <PageHeader title="Analytics Dashboard" description="Overview of your store's performance" />

      <div className="flex-1 overflow-auto">
        <div className="w-full pr-2">
          <AnalyticsDashboard />
        </div>
      </div>
    </div>
  );
}
