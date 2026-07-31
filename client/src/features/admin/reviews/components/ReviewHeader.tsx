import { MessageSquareQuote } from 'lucide-react';

export function ReviewHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 md:px-6 lg:px-0">
      <div className="flex items-center gap-3 md:gap-4 relative group">
        <div className="relative">
          <div className="absolute inset-0 bg-[oklch(0.55_0_0)] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
          <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[oklch(0.18_0.005_260)] border border-[oklch(1_0_0_/_0.08)] shadow-[inset_0_1px_1px_oklch(1_0_0_/_0.15)] group-hover:border-[oklch(1_0_0_/_0.2)] transition-colors duration-500">
            <MessageSquareQuote className="h-5 w-5 md:h-6 md:w-6 text-[oklch(0.95_0_0)]" />
          </div>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-[oklch(0.98_0_0)] tracking-tight">
            Reviews
          </h1>
          <p className="text-xs md:text-sm text-[oklch(0.6_0_0)] mt-0.5">
            Manage product reviews and user permissions.
          </p>
        </div>
      </div>
    </div>
  );
}
