import { memo } from 'react';
import { Crown, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleBadgeProps {
  role: 'ADMIN' | 'USER';
  className?: string;
}

export const RoleBadge = memo(function RoleBadge({ role, className }: RoleBadgeProps) {
  const isAdmin = role === 'ADMIN';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10.5px] font-bold tracking-wider uppercase select-none transition-all',
        isAdmin
          ? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
          : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
        className,
      )}
    >
      {isAdmin ? (
        <Crown size={11} strokeWidth={2.2} className="text-amber-400" />
      ) : (
        <Shield size={11} strokeWidth={2} className="text-indigo-400" />
      )}
      <span>{role}</span>
    </span>
  );
});

interface AccountStatusBadgeProps {
  isBlocked?: boolean;
  className?: string;
}

export const AccountStatusBadge = memo(function AccountStatusBadge({
  isBlocked = false,
  className,
}: AccountStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10.5px] font-medium tracking-wide select-none transition-all',
        isBlocked
          ? 'bg-red-500/10 text-red-400 border-red-500/25'
          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
        className,
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          isBlocked ? 'bg-red-500' : 'bg-emerald-400 animate-pulse',
        )}
      />
      <span>{isBlocked ? 'Blocked' : 'Active'}</span>
    </span>
  );
});

interface VerificationBadgeProps {
  emailVerified: boolean;
  className?: string;
}

export const VerificationBadge = memo(function VerificationBadge({
  emailVerified,
  className,
}: VerificationBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10.5px] font-medium tracking-wide select-none transition-all',
        emailVerified
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        className,
      )}
    >
      {emailVerified ? (
        <>
          <CheckCircle2 size={11} strokeWidth={2} className="text-emerald-400" />
          <span>Verified</span>
        </>
      ) : (
        <>
          <AlertTriangle size={11} strokeWidth={2} className="text-amber-400" />
          <span>Unverified</span>
        </>
      )}
    </span>
  );
});

export default RoleBadge;
