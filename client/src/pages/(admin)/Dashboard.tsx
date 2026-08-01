import { DashboardOverview } from '@/features/admin/dashboard/components/DashboardOverview';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground mt-2">
          Here's a quick summary of what's happening across the platform today.
        </p>
      </div>
      <DashboardOverview />
    </div>
  );
}
