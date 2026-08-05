import { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, type UpdateProfileDto } from '@snitch/schemas';
import type { JwtAccessTokenPayload } from '@snitch/types';
import { User, Mail, Phone, Upload, Loader2, Copy, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { setFormErrors } from '@/utils/form-errors.util';
import { AxiosError } from 'axios';

interface PersonalInformationFormProps {
  user: JwtAccessTokenPayload;
  onSave: (
    data: UpdateProfileDto,
  ) => Promise<{ success: boolean; message: string; error?: unknown }>;
  onDirtyChange?: (isDirty: boolean) => void;
}

export const PersonalInformationForm = memo(function PersonalInformationForm({
  user,
  onSave,
  onDirtyChange,
}: PersonalInformationFormProps) {
  const [copiedId, setCopiedId] = useState(false);

  const defaultValues: UpdateProfileDto = {
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    avatar: user.avatar ?? null,
    email: user.email ?? '',
    contact: {
      countryCode: user.contact?.countryCode ?? '+91',
      phoneNumber: user.contact?.phoneNumber ?? '',
    },
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileDto>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
  });

  const avatarValue = watch('avatar');
  const firstNameValue = watch('firstName');
  const lastNameValue = watch('lastName');

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const fullName =
    `${firstNameValue || user.firstName} ${lastNameValue || user.lastName || ''}`.trim();
  const initials =
    (
      (firstNameValue?.[0] ?? user.firstName?.[0] ?? '') +
      (lastNameValue?.[0] ?? user.lastName?.[0] ?? '')
    ).toUpperCase() || 'U';

  const handleCopyId = () => {
    if (user.sub) {
      navigator.clipboard.writeText(user.sub);
      setCopiedId(true);
      showToast.success('User ID copied to clipboard');
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const onSubmit = async (data: UpdateProfileDto) => {
    try {
      const res = await onSave(data);
      if (res.success) {
        showToast.success(res.message || 'Profile updated successfully!');
        reset(data); // Reset form dirty state after successful save
      } else {
        showToast.error(res.message || 'Failed to update profile');
        if (res.error && res.error instanceof AxiosError) {
          const fields = res.error.response?.data?.error?.fields;
          if (fields) {
            setFormErrors(fields, setError);
          }
        }
      }
    } catch {
      showToast.error('An unexpected error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs sm:text-sm">
      {/* Profile Photo Header Card */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <Avatar className="size-14 sm:size-16 border border-white/20 rounded-full shrink-0 shadow-md">
            <AvatarImage src={avatarValue ?? undefined} alt={fullName} className="object-cover" />
            <AvatarFallback className="bg-zinc-900 text-white font-bold text-base">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-white truncate">{fullName}</h3>
            <p className="text-xs text-white/50 truncate font-mono">{user.email}</p>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-orange-400 font-medium">
              <Upload size={12} />
              <span>Update Avatar URL below</span>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Image URL input */}
      <div>
        <label className="block text-xs font-semibold text-white/70 mb-1">
          Profile Photo URL (Optional)
        </label>
        <input
          type="url"
          placeholder="https://example.com/avatar.jpg"
          {...register('avatar')}
          className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-white/12 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500 transition-colors"
        />
        {errors.avatar && <p className="text-[11px] text-red-400 mt-1">{errors.avatar.message}</p>}
      </div>

      {/* Grid: First Name & Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-white/70 mb-1">
            First Name <span className="text-orange-500">*</span>
          </label>
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="First name"
              {...register('firstName')}
              className={cn(
                'w-full h-9 pl-9 pr-3 rounded-lg bg-zinc-900 border text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors',
                errors.firstName
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-white/12 focus:border-orange-500',
              )}
            />
          </div>
          {errors.firstName && (
            <p className="text-[11px] text-red-400 mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/70 mb-1">Last Name</label>
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Last name"
              {...register('lastName')}
              className={cn(
                'w-full h-9 pl-9 pr-3 rounded-lg bg-zinc-900 border text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors',
                errors.lastName
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-white/12 focus:border-orange-500',
              )}
            />
          </div>
          {errors.lastName && (
            <p className="text-[11px] text-red-400 mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Username / User ID Readonly */}
      <div>
        <label className="block text-xs font-semibold text-white/70 mb-1">User Identifier</label>
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-zinc-900/60 border border-white/8 text-xs font-mono text-white/60 select-all">
          <span className="truncate flex-1">{user.sub}</span>
          <button
            type="button"
            onClick={handleCopyId}
            aria-label="Copy User ID"
            className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            {copiedId ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-xs font-semibold text-white/70 mb-1">
          Email Address <span className="text-orange-500">*</span>
        </label>
        <div className="relative">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className={cn(
              'w-full h-9 pl-9 pr-3 rounded-lg bg-zinc-900 border text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors',
              errors.email
                ? 'border-red-500 focus:border-red-500'
                : 'border-white/12 focus:border-orange-500',
            )}
          />
        </div>
        {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email.message}</p>}
      </div>

      {/* Contact Phone */}
      <div>
        <label className="block text-xs font-semibold text-white/70 mb-1">
          Phone Number <span className="text-orange-500">*</span>
        </label>
        <div className="flex gap-2">
          <div className="w-24 shrink-0">
            <input
              type="text"
              placeholder="+91"
              {...register('contact.countryCode')}
              className={cn(
                'w-full h-9 px-3 rounded-lg bg-zinc-900 border text-xs text-white text-center placeholder:text-white/30 focus:outline-none transition-colors font-mono',
                errors.contact?.countryCode
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-white/12 focus:border-orange-500',
              )}
            />
          </div>
          <div className="relative flex-1">
            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="tel"
              placeholder="9876543210"
              {...register('contact.phoneNumber')}
              className={cn(
                'w-full h-9 pl-9 pr-3 rounded-lg bg-zinc-900 border text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors font-mono',
                errors.contact?.phoneNumber
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-white/12 focus:border-orange-500',
              )}
            />
          </div>
        </div>
        {(errors.contact?.countryCode || errors.contact?.phoneNumber) && (
          <p className="text-[11px] text-red-400 mt-1">
            {errors.contact?.countryCode?.message || errors.contact?.phoneNumber?.message}
          </p>
        )}
      </div>

      {/* Save Button Bar */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => reset(defaultValues)}
          disabled={!isDirty || isSubmitting}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40 cursor-pointer"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className={cn(
            'px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer flex items-center gap-1.5',
            !isDirty || isSubmitting
              ? 'bg-orange-600/40 text-white/50 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-orange-500 shadow-sm active:scale-95',
          )}
        >
          {isSubmitting && <Loader2 size={13} className="animate-spin" />}
          <span>Save Personal Info</span>
        </button>
      </div>
    </form>
  );
});

export default PersonalInformationForm;
