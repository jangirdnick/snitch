import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { UserResponseDto } from '@snitch/types';
import CustomerActions from './CustomerActions';
import {
  User,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Calendar,
  BadgeCheck,
  ShieldAlert,
} from 'lucide-react';

interface CustomersTableProps {
  users: UserResponseDto[];
  isLoading: boolean;
  onUpdate: () => void;
}

const getStatusBadge = (isBlocked?: boolean) => {
  if (isBlocked) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10.5px] font-semibold tracking-wide whitespace-nowrap bg-[oklch(0.42_0_0_/_0.08)] text-[oklch(0.50_0_0)] border-[oklch(0.42_0_0_/_0.18)]">
        <span className="size-1.5 rounded-full shrink-0 bg-[oklch(0.42_0_0)] shadow-[0_0_6px_oklch(0.42_0_0_/_0.4)]" />
        Blocked
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10.5px] font-semibold tracking-wide whitespace-nowrap bg-[oklch(0.70_0.15_160_/_0.10)] text-[oklch(0.82_0.15_160)] border-[oklch(0.70_0.15_160_/_0.25)]">
      <span className="size-1.5 rounded-full shrink-0 bg-[oklch(0.70_0.15_160)] shadow-[0_0_6px_oklch(0.70_0.15_160_/_0.7)]" />
      Active
    </span>
  );
};

const getRoleBadge = (role: string) => {
  if (role === 'ADMIN') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-950/40 text-orange-400 border border-orange-900/50 text-[10px] uppercase font-bold tracking-wider">
        <ShieldAlert className="size-3" />
        ADMIN
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[oklch(1_0_0_/_0.05)] text-[oklch(0.7_0_0)] border border-[oklch(1_0_0_/_0.08)] text-[10px] uppercase font-semibold tracking-wider">
      <User className="size-3" />
      USER
    </span>
  );
};

const formatDate = (dateString?: Date | string) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const getInitials = (first: string, last?: string) => {
  return `${first.charAt(0)}${last ? last.charAt(0) : ''}`.toUpperCase();
};

export default function CustomersTable({ users, isLoading, onUpdate }: CustomersTableProps) {
  if (isLoading) {
    return (
      <div className="w-full h-full p-6">
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
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow
                key={index}
                className="border-b-[oklch(1_0_0_/_0.055)] hover:bg-transparent"
              >
                {Array.from({ length: 7 }).map((_, i) => (
                  <TableCell key={i}>
                    <Skeleton className="h-4 w-full max-w-[120px] bg-[oklch(1_0_0_/_0.05)]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-transparent">
        <div className="text-[oklch(0.55_0_0)] text-[13px] font-medium tracking-wide">
          No customers found.
        </div>
      </div>
    );
  }

  const thClass =
    'text-[oklch(0.55_0_0)] uppercase tracking-wider text-[10px] font-semibold h-10 border-b-[oklch(1_0_0_/_0.055)] px-4 whitespace-nowrap';
  const tdClass = 'py-3 px-4 text-[13px] text-[oklch(0.85_0_0)] font-medium whitespace-nowrap';
  const rowClass =
    'group transition-colors border-b-[oklch(1_0_0_/_0.055)] hover:bg-[oklch(1_0_0_/_0.04)]';

  return (
    <div className="w-full h-full bg-transparent overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b-[oklch(1_0_0_/_0.055)]">
            <TableHead className={cn(thClass, 'min-w-[220px]')}>
              <div className="flex items-center gap-1.5">
                <User className="size-3.5" /> Customer
              </div>
            </TableHead>
            <TableHead className={cn(thClass, 'min-w-[180px]')}>
              <div className="flex items-center gap-1.5">
                <Mail className="size-3.5" /> Contact
              </div>
            </TableHead>
            <TableHead className={thClass}>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" /> Role
              </div>
            </TableHead>
            <TableHead className={thClass}>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5" /> Joined
              </div>
            </TableHead>
            <TableHead className={thClass}>
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5" /> Last Active
              </div>
            </TableHead>
            <TableHead className={thClass}>Status</TableHead>
            <TableHead className={cn(thClass, 'w-[80px] text-right')}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className={rowClass}>
              {/* CUSTOMER */}
              <TableCell className={tdClass}>
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="size-9 rounded-full object-cover border border-[oklch(1_0_0_/_0.1)]"
                    />
                  ) : (
                    <div className="size-9 rounded-full bg-[oklch(1_0_0_/_0.08)] border border-[oklch(1_0_0_/_0.1)] flex items-center justify-center text-[oklch(0.8_0_0)] text-xs font-bold tracking-widest shrink-0">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-[oklch(0.95_0_0)] truncate max-w-[180px]">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-[11px] text-[oklch(0.6_0_0)] font-mono mt-0.5 truncate max-w-[180px]">
                      {user.id}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* CONTACT (Email & Phone) */}
              <TableCell className={tdClass}>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] text-[oklch(0.85_0_0)] truncate max-w-[160px]">
                      {user.email}
                    </span>
                    {user.emailVerified && (
                      <BadgeCheck className="size-3.5 text-blue-400 shrink-0" />
                    )}
                  </div>
                  {(user.contact?.countryCode || user.contact?.phoneNumber) && (
                    <div className="flex items-center gap-1.5 text-[11.5px] text-[oklch(0.6_0_0)] font-medium">
                      <Phone className="size-3" />
                      {user.contact.countryCode} {user.contact.phoneNumber}
                    </div>
                  )}
                </div>
              </TableCell>

              {/* ROLE */}
              <TableCell className={tdClass}>{getRoleBadge(user.role)}</TableCell>

              {/* JOINED */}
              <TableCell className={tdClass}>
                <span className="text-[12px] text-[oklch(0.7_0_0)]">
                  {formatDate(user.createdAt)}
                </span>
              </TableCell>

              {/* LAST ACTIVE */}
              <TableCell className={tdClass}>
                <span className="text-[12px] text-[oklch(0.7_0_0)]">
                  {formatDate(user.lastLoginAt)}
                </span>
              </TableCell>

              {/* STATUS */}
              <TableCell className="px-4 py-3">{getStatusBadge(user.isBlocked)}</TableCell>

              {/* ACTIONS */}
              <TableCell className="px-4 py-3 text-right">
                <CustomerActions customer={user} onUpdate={onUpdate} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
