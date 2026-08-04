import { memo } from 'react';
import { Calendar, Clock, RefreshCw } from 'lucide-react';
import type { JwtAccessTokenPayload } from '@snitch/types';
import { ProfileReadOnlyField } from './ProfileReadOnlyField';

interface ProfileActivityCardProps {
  user: JwtAccessTokenPayload;
}

function formatDate(dateValue: Date | string | undefined): string {
  if (!dateValue) return 'Not available';
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return 'Not available';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return 'Not available';
  }
}

export const ProfileActivityCard = memo(function ProfileActivityCard({
  user,
}: ProfileActivityCardProps) {
  const createdAtFormatted = formatDate(user.createdAt);
  const lastLoginFormatted = formatDate(user.lastLoginAt);
  const updatedAtFormatted = formatDate(user.updatedAt);

  return (
    <div className="flex flex-col">
      <ProfileReadOnlyField label="Account Created" value={createdAtFormatted} icon={Calendar} />
      <ProfileReadOnlyField label="Last Session Login" value={lastLoginFormatted} icon={Clock} />
      <ProfileReadOnlyField
        label="Profile Last Updated"
        value={updatedAtFormatted}
        icon={RefreshCw}
      />
    </div>
  );
});

export default ProfileActivityCard;
