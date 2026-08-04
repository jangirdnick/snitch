import { memo } from 'react';
import { User, Mail, Phone, Fingerprint } from 'lucide-react';
import type { JwtAccessTokenPayload } from '@snitch/types';
import { ProfileReadOnlyField } from './ProfileReadOnlyField';

interface ProfileDetailsCardProps {
  user: JwtAccessTokenPayload;
}

export const ProfileDetailsCard = memo(function ProfileDetailsCard({
  user,
}: ProfileDetailsCardProps) {
  const fullName = `${user.firstName} ${user.lastName ?? ''}`.trim();
  const phoneFormatted =
    user.contact?.countryCode && user.contact?.phoneNumber
      ? `${user.contact.countryCode} ${user.contact.phoneNumber}`
      : (user.contact?.phoneNumber ?? '');

  return (
    <div className="flex flex-col">
      <ProfileReadOnlyField label="Full Name" value={fullName} icon={User} />
      <ProfileReadOnlyField
        label="Username / ID"
        value={user.sub}
        icon={Fingerprint}
        isMonospace
        copyable
      />
      <ProfileReadOnlyField label="Email Address" value={user.email} icon={Mail} copyable />
      <ProfileReadOnlyField
        label="Phone Number"
        value={phoneFormatted}
        icon={Phone}
        copyable={!!phoneFormatted}
      />
    </div>
  );
});

export default ProfileDetailsCard;
