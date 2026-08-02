import { cn } from '@/lib/utils';
import type { Ticket, TicketStatus, TicketPriority } from '@snitch/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MoreHorizontal,
  Eye,
  Hash,
  Tag,
  Calendar,
  User,
  AlertCircle,
  LifeBuoy,
} from 'lucide-react';

interface SupportTicketTableProps {
  items: Ticket[];
  loading: boolean;
  onViewDetails: (ticket: Ticket) => void;
}

const STATUS_CONFIG: Record<TicketStatus, { label: string; dot: string; badge: string }> = {
  OPEN: {
    label: 'Open',
    dot: 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.7)]',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    dot: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  WAITING: {
    label: 'Waiting',
    dot: 'bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.7)]',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  RESOLVED: {
    label: 'Resolved',
    dot: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  CLOSED: {
    label: 'Closed',
    dot: 'bg-gray-500 shadow-[0_0_6px_rgba(107,114,128,0.7)]',
    badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  },
};

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string }> = {
  URGENT: { label: 'Urgent', color: 'text-red-500' },
  HIGH: { label: 'High', color: 'text-orange-500' },
  MEDIUM: { label: 'Medium', color: 'text-amber-500' },
  LOW: { label: 'Low', color: 'text-emerald-500' },
};

const formatDate = (dateString?: Date | string | undefined) => {
  if (!dateString) return '-';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  } catch {
    return '-';
  }
};

export function SupportTicketTable({ items, loading, onViewDetails }: SupportTicketTableProps) {
  const getStatusBadge = (status: TicketStatus) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.OPEN;
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10.5px] font-semibold tracking-wide whitespace-nowrap',
          cfg.badge,
        )}
      >
        <span className={cn('size-1.5 rounded-full shrink-0', cfg.dot)} />
        {cfg.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-transparent p-6">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[oklch(1_0_0_/_0.055)] hover:bg-transparent">
              {Array.from({ length: 7 }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-20 bg-[oklch(1_0_0_/_0.05)]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow
                key={index}
                className="border-b-[oklch(1_0_0_/_0.055)] hover:bg-transparent"
              >
                {Array.from({ length: 7 }).map((_, i) => (
                  <TableCell key={i}>
                    <Skeleton className="h-4 w-24 bg-[oklch(1_0_0_/_0.05)]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-transparent">
        <div className="text-[oklch(0.55_0_0)] text-[13px] font-medium tracking-wide">
          No support tickets found.
        </div>
      </div>
    );
  }

  const thClass =
    'text-[oklch(0.55_0_0)] uppercase tracking-wider text-[10px] font-semibold h-10 border-b-[oklch(1_0_0_/_0.055)] px-4 whitespace-nowrap';
  const tdClass = 'py-3 px-4 text-[13px] text-[oklch(0.85_0_0)] font-medium whitespace-nowrap';
  const rowClass =
    'group transition-colors border-b-[oklch(1_0_0_/_0.055)] hover:bg-[oklch(1_0_0_/_0.03)] cursor-pointer';

  return (
    <div className="w-full h-full bg-transparent overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b-[oklch(1_0_0_/_0.055)]">
            <TableHead className={thClass}>
              <div className="flex items-center gap-1.5">
                <Hash className="size-3.5" /> ID
              </div>
            </TableHead>
            <TableHead className={thClass}>
              <div className="flex items-center gap-1.5">
                <User className="size-3.5" /> Customer
              </div>
            </TableHead>
            <TableHead className={thClass}>
              <div className="flex items-center gap-1.5">
                <LifeBuoy className="size-3.5" /> Subject
              </div>
            </TableHead>
            <TableHead className={thClass}>
              <div className="flex items-center gap-1.5">
                <Tag className="size-3.5" /> Category
              </div>
            </TableHead>
            <TableHead className={thClass}>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="size-3.5" /> Priority
              </div>
            </TableHead>
            <TableHead className={thClass}>Status</TableHead>
            <TableHead className={thClass}>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5" /> Created Date
              </div>
            </TableHead>
            <TableHead className={cn(thClass, 'w-[80px] text-right')}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((ticket) => {
            const priorityConfig = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.LOW;
            return (
              <TableRow key={ticket._id} className={rowClass} onClick={() => onViewDetails(ticket)}>
                <TableCell className={tdClass}>
                  <span
                    className="text-[oklch(0.6_0_0)] font-mono text-[11px] truncate max-w-[100px] block"
                    title={ticket.ticketId}
                  >
                    {ticket.ticketId}
                  </span>
                </TableCell>
                <TableCell className={tdClass}>
                  <div className="flex flex-col">
                    <span className="text-[13px] text-[oklch(0.9_0_0)] font-semibold">
                      {ticket.user?.firstName} {ticket.user?.lastName}
                    </span>
                    <span className="text-[11px] text-[oklch(0.5_0_0)]">{ticket.user?.email}</span>
                  </div>
                </TableCell>
                <TableCell className={tdClass}>
                  <div
                    className="truncate max-w-[200px] font-medium text-[oklch(0.95_0_0)]"
                    title={ticket.subject}
                  >
                    {ticket.subject}
                  </div>
                </TableCell>
                <TableCell className={tdClass}>
                  <span className="text-[oklch(0.7_0_0)] text-[12px] uppercase tracking-wide">
                    {ticket.category.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell className={tdClass}>
                  <span
                    className={`text-[12px] font-bold tracking-wide uppercase ${priorityConfig.color}`}
                  >
                    {priorityConfig.label}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3">{getStatusBadge(ticket.status)}</TableCell>
                <TableCell className={tdClass}>
                  <span className="text-[oklch(0.65_0_0)]">{formatDate(ticket.createdAt)}</span>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-[oklch(1_0_0_/_0.08)] text-[oklch(0.7_0_0)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-[oklch(0.13_0.005_260)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] shadow-[0_8px_32px_oklch(0_0_0_/_0.6)] rounded-xl min-w-[160px]"
                    >
                      <DropdownMenuLabel className="text-[10px] uppercase text-[oklch(0.55_0_0)] font-bold tracking-wider">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => onViewDetails(ticket)}
                        className="cursor-pointer focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)] rounded-lg mx-1 my-0.5 min-h-[40px] md:min-h-[32px]"
                      >
                        <Eye className="mr-2 h-4 w-4 text-[oklch(0.6_0_0)]" /> View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
