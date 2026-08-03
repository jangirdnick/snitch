import { Outlet } from 'react-router';
import { TooltipProvider } from '@components/ui/tooltip';
import AdminSidebar from '@/features/admin/components/AdminSidebar';
import AdminMobileNav from '@/features/admin/components/AdminMobileNav';

export default function AdminLayout() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen w-full overflow-hidden bg-[oklch(0.09_0_0)] max-md:p-2">
        {/* ── Desktop sidebar — hidden below lg ──────────────────── */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* ── Main content ───────────────────────────────────────── */}
        {/*
         * Desktop: offset left by sidebar width (ml-20)
         * Mobile:  full width, pad bottom so content clears the nav bar
         *          80px nav + safe-area-inset-bottom + 8px breathing room
         */}
        <main
          id="main-content"
          className="flex-1 overflow-hidden h-full min-h-0 lg:ml-20 lg:px-1.5 lg:py-4"
          aria-label="Main content"
        >
          <Outlet />
        </main>

        {/* ── Mobile bottom nav — hidden on lg and above ─────────── */}
        <div className="lg:hidden">
          <AdminMobileNav />
        </div>
      </div>
    </TooltipProvider>
  );
}
