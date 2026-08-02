import { useState } from 'react';
import { useSupport } from '@/features/support/hook/useSupport';
import { SupportTicketTable } from '@/features/support/components/SupportTicketTable';
import { SupportTicketDetailsDialog } from '@/features/support/components/SupportTicketDetailsDialog';
import { AdminFilters } from '@/components/admin/AdminFilters';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { useDebounce } from '@/hooks/useDebounce';
import type { Ticket, TicketStatus, TicketPriority } from '@snitch/types';
import { PageHeader } from '@/components/ui/page-header';
import { MessageSquare, TrendingUp } from 'lucide-react';

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const { data, isLoading, updateStatus, addNote, addReply } = useSupport({
    page: currentPage,
    limit: 10,
    status: statusFilter,
    priority: priorityFilter,
    ticketId: debouncedSearch,
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-3.5 sm:gap-5 lg:gap-6 h-screen bg-[oklch(0.08_0.005_260)] selection:bg-[oklch(0.95_0_0)] selection:text-[oklch(0.1_0_0)] pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-1 overflow-y-scroll">
      <PageHeader
        title="Support Tickets"
        description="Manage customer support inquiries, updates, and resolutions."
      >
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none flex items-center gap-3 bg-[oklch(1_0_0/0.03)] border border-[oklch(1_0_0/0.08)] rounded-xl px-3 sm:px-4 py-2 shadow-sm">
            <div className="bg-blue-500/20 text-blue-400 p-2 rounded-lg shrink-0">
              <MessageSquare className="size-4" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] text-[oklch(0.55_0_0)] uppercase tracking-wider font-bold">
                Needs Action
              </div>
              <div className="text-[13px] sm:text-[14px] font-semibold text-[oklch(0.95_0_0)]">
                {data?.items.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS')
                  .length || 0}{' '}
                Tickets
              </div>
            </div>
          </div>
          <div className="flex-1 sm:flex-none flex items-center gap-3 bg-[oklch(1_0_0/0.03)] border border-[oklch(1_0_0/0.08)] rounded-xl px-3 sm:px-4 py-2 shadow-sm">
            <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg shrink-0">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] text-[oklch(0.55_0_0)] uppercase tracking-wider font-bold">
                New Today
              </div>
              <div className="text-[13px] sm:text-[14px] font-semibold text-[oklch(0.95_0_0)]">
                +
                {data?.items.filter(
                  (t) => new Date(t.createdAt).toDateString() === new Date().toDateString(),
                ).length || 0}{' '}
                Tickets
              </div>
            </div>
          </div>
        </div>
      </PageHeader>

      <AdminFilters
        searchTerm={searchTerm}
        searchPlaceholder="Search by Ticket ID..."
        debouncedSearch={debouncedSearch}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={(val) => {
          setStatusFilter(val as TicketStatus | 'all');
          setCurrentPage(1);
        }}
        statusOptions={[
          { label: 'All Statuses', value: 'all' },
          {
            label: 'Open',
            value: 'OPEN',
            dotClass: 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.7)]',
          },
          {
            label: 'In Progress',
            value: 'IN_PROGRESS',
            dotClass: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]',
          },
          {
            label: 'Waiting',
            value: 'WAITING',
            dotClass: 'bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.7)]',
          },
          {
            label: 'Resolved',
            value: 'RESOLVED',
            dotClass: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]',
          },
          {
            label: 'Closed',
            value: 'CLOSED',
            dotClass: 'bg-gray-500 shadow-[0_0_6px_rgba(107,114,128,0.7)]',
          },
        ]}
        sortValue={priorityFilter}
        onSortChange={(val) => {
          setPriorityFilter(val as TicketPriority | 'all');
          setCurrentPage(1);
        }}
        sortOptions={[
          { label: 'All Priorities', value: 'all' },
          { label: 'Urgent', value: 'URGENT' },
          { label: 'High', value: 'HIGH' },
          { label: 'Medium', value: 'MEDIUM' },
          { label: 'Low', value: 'LOW' },
        ]}
        onClearFilters={handleClearFilters}
      />

      <div
        className={
          'group relative rounded-2xl flex-1 flex flex-col justify-between ' +
          'md:overflow-y-scroll md:min-h-0 md:h-full ' +
          'bg-linear-to-b from-[oklch(0.145_0.005_260)] to-[oklch(0.115_0.005_260)] ' +
          'border border-[oklch(1_0_0/0.055)] hover:border-[oklch(1_0_0/0.11)] ' +
          'transition-all duration-500 ease-in-out ' +
          'shadow-[0_4px_24px_oklch(0_0_0/0.35)] hover:shadow-[0_8px_32px_oklch(0_0_0/0.5)] ' +
          'mx-4 md:mx-6 lg:mx-0'
        }
      >
        <SupportTicketTable
          items={data?.items || []}
          loading={isLoading}
          onViewDetails={setSelectedTicket}
        />

        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="border-t border-[oklch(1_0_0/0.055)] px-4 py-3 shrink-0 bg-[oklch(1_0_0/0.015)]">
            <AdminPagination
              currentPage={data.pagination.currentPage}
              totalPages={data.pagination.totalPages}
              hasNextPage={data.pagination.hasNextPage}
              hasPreviousPage={data.pagination.hasPreviousPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <SupportTicketDetailsDialog
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdateStatus={async (id, payload) => {
          const success = await updateStatus(id, payload);
          if (success && selectedTicket) {
            setSelectedTicket({ ...selectedTicket, ...payload } as Ticket);
          }
          return success;
        }}
        onAddNote={async (id, note) => {
          const success = await addNote(id, note);
          if (success && selectedTicket) {
            setSelectedTicket({
              ...selectedTicket,
              internalNotes: [...(selectedTicket.internalNotes || []), note],
            } as Ticket);
          }
          return success;
        }}
        onAddReply={async (id, message) => {
          const success = await addReply(id, message);
          if (success && selectedTicket) {
            setSelectedTicket({
              ...selectedTicket,
              replies: [
                ...(selectedTicket.replies || []),
                {
                  _id: Date.now().toString(),
                  senderId: 'admin',
                  senderModel: 'Admin',
                  message,
                  createdAt: new Date(),
                } as import('@snitch/types').TicketReply,
              ],
            } as Ticket);
          }
          return success;
        }}
      />
    </div>
  );
}
