import { PageHeader } from '@/components/ui/page-header';
import { DashboardOverview } from '@/features/admin/dashboard/components/DashboardOverview';

export default function Dashboard() {
  return (
    <div className="flex-1 h-full overflow-y-auto space-y-4 md:space-y-6 pb-22 lg:pb-4 sm:p-2 lg:p-0">
      <PageHeader
        title="Command Center"
        description="Real-time operational pulse, inventory alerts, and platform health."
      />
      <DashboardOverview />
    </div>
  );
}
