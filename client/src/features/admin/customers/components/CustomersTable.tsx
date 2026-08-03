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
      <div className="w-full h-full p-4 md:p-6">
        {/* Desktop Skeleton Table */}
        <div className="hidden md:block">
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

        {/* Mobile Skeleton Cards */}
        <div className="block md:hidden space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-[oklch(1_0_0/0.065)] bg-[oklch(1_0_0/0.02)] space-y-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full bg-[oklch(1_0_0/0.06)]" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-32 bg-[oklch(1_0_0/0.06)]" />
                  <Skeleton className="h-3 w-44 bg-[oklch(1_0_0/0.06)]" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[oklch(1_0_0/0.04)]">
                <Skeleton className="h-5 w-16 bg-[oklch(1_0_0/0.06)]" />
                <Skeleton className="h-5 w-16 bg-[oklch(1_0_0/0.06)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-20 text-[oklch(0.55_0_0)] bg-transparent rounded-lg border-none px-4 text-center">
        <User className="h-10 w-10 md:h-12 md:w-12 mb-3 md:mb-4 opacity-30 text-[oklch(0.55_0_0)]" />
        <div className="text-[13px] font-medium tracking-wide">No customers found.</div>
        <p className="text-xs mt-1 opacity-70">Try adjusting your search query.</p>
      </div>
    );
  }

  const thClass =
    'text-[oklch(0.55_0_0)] uppercase tracking-wider text-[10px] font-semibold h-10 border-b-[oklch(1_0_0_/_0.055)] px-4 whitespace-nowrap';
  const tdClass = 'py-3 px-4 text-[13px] text-[oklch(0.85_0_0)] font-medium whitespace-nowrap';
  const rowClass =
    'group transition-colors border-b-[oklch(1_0_0_/_0.055)] hover:bg-[oklch(1_0_0_/_0.04)]';

  return (
    <>
      {/* DESKTOP TABLE VIEW (Unchanged for md+) */}
      <div className="hidden md:block w-full h-full bg-transparent overflow-x-auto">
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

      {/* MOBILE RESPONSIVE CARDS VIEW (block md:hidden) */}
      <div className="block md:hidden p-3 sm:p-4 space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className={cn(
              'rounded-xl p-4 transition-all duration-300',
              'bg-gradient-to-b from-[oklch(0.14_0.005_260)] to-[oklch(0.12_0.005_260)]',
              'border border-[oklch(1_0_0/0.07)] hover:border-[oklch(1_0_0/0.14)]',
              'shadow-sm flex flex-col gap-3',
            )}
          >
            {/* Top row: Avatar + Name + Badges + Action dropdown */}
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[oklch(1_0_0/0.05)]">
              <div className="flex items-center gap-3 min-w-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.firstName}
                    className="size-10 rounded-full object-cover border border-[oklch(1_0_0_/_0.1)] shrink-0"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-[oklch(1_0_0_/_0.08)] border border-[oklch(1_0_0_/_0.1)] flex items-center justify-center text-[oklch(0.85_0_0)] text-xs font-bold tracking-widest shrink-0">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[oklch(0.95_0_0)] text-sm truncate">
                      {user.firstName} {user.lastName}
                    </span>
                    {user.emailVerified && (
                      <BadgeCheck className="size-3.5 text-blue-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-[oklch(0.6_0_0)] truncate">{user.email}</span>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-1">
                <CustomerActions customer={user} onUpdate={onUpdate} />
              </div>
            </div>

            {/* Badges row: Role & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.isBlocked)}
              </div>
              {(user.contact?.countryCode || user.contact?.phoneNumber) && (
                <div className="flex items-center gap-1 text-[11px] text-[oklch(0.6_0_0)] font-medium">
                  <Phone className="size-3" />
                  {user.contact.countryCode} {user.contact.phoneNumber}
                </div>
              )}
            </div>

            {/* Dates row */}
            <div className="flex items-center justify-between pt-2 border-t border-[oklch(1_0_0/0.05)] text-[11px] text-[oklch(0.6_0_0)]">
              <div>
                <span className="text-[10px] uppercase text-[oklch(0.5_0_0)] block font-semibold">
                  Joined
                </span>
                <span>{formatDate(user.createdAt)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-[oklch(0.5_0_0)] block font-semibold">
                  Last Active
                </span>
                <span>{formatDate(user.lastLoginAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
