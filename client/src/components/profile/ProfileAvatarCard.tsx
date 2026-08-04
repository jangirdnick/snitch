import { memo, useMemo } from 'react';
import { User as UserIcon, Crown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { cn } from '@/lib/utils';
import type { JwtAccessTokenPayload } from '@snitch/types';
import { RoleBadge } from './ProfileStatusBadges';

interface ProfileAvatarCardProps {
  user: JwtAccessTokenPayload;
}

export const ProfileAvatarCard = memo(function ProfileAvatarCard({ user }: ProfileAvatarCardProps) {
  const initials = useMemo(() => {
    const f = user.firstName?.[0] ?? '';
    const l = user.lastName?.[0] ?? '';
    return (f + l).toUpperCase() || 'U';
  }, [user]);

  const fullName = `${user.firstName} ${user.lastName ?? ''}`.trim();
  const isAdmin = user.role === 'ADMIN';

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl',
        'bg-white/5 border border-white/10 shadow-xs',
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="size-11 sm:size-12 border border-white/15 rounded-full shrink-0">
          <AvatarImage src={user.avatar ?? undefined} alt={fullName} className="object-cover" />
          <AvatarFallback className="bg-black/90 text-white text-sm font-bold tracking-wider">
            {initials ||
              (isAdmin ? (
                <Crown size={16} className="text-amber-400" />
              ) : (
                <UserIcon size={16} className="text-indigo-400" />
              ))}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-white tracking-tight truncate leading-tight">
            {fullName}
          </h2>
          <p className="text-xs font-mono text-white/50 truncate mt-0.5">{user.email}</p>
        </div>
      </div>

      <RoleBadge role={user.role} className="shrink-0" />
    </div>
  );
});

export default ProfileAvatarCard;
