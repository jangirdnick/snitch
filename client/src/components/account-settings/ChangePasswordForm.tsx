import { memo, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, type ChangePasswordDto } from '@snitch/schemas';
import { Eye, EyeOff, Lock, Check, X as XIcon, Loader2, ShieldAlert } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { setFormErrors } from '@/utils/form-errors.util';
import { AxiosError } from 'axios';

interface ChangePasswordFormProps {
  onSave: (
    data: ChangePasswordDto,
  ) => Promise<{ success: boolean; message: string; error?: unknown }>;
  onDirtyChange?: (isDirty: boolean) => void;
}

export const ChangePasswordForm = memo(function ChangePasswordForm({
  onSave,
  onDirtyChange,
}: ChangePasswordFormProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ChangePasswordDto>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const newPasswordValue = watch('newPassword') || '';

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // Password strength score calculation
  const strengthChecks = useMemo(() => {
    const minLength = newPasswordValue.length >= 6;
    const hasUpper = /[A-Z]/.test(newPasswordValue);
    const hasLower = /[a-z]/.test(newPasswordValue);
    const hasNumber = /\d/.test(newPasswordValue);
    const hasSpecial = /[@$!%*?&]/.test(newPasswordValue);

    const passedCount = [minLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(
      Boolean,
    ).length;
    let label = 'Weak';
    let colorClass = 'bg-red-500';
    const percent = 20 * passedCount;

    if (passedCount >= 5) {
      label = 'Strong';
      colorClass = 'bg-emerald-500';
    } else if (passedCount >= 3) {
      label = 'Medium';
      colorClass = 'bg-amber-500';
    }

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      passedCount,
      percent,
      label,
      colorClass,
    };
  }, [newPasswordValue]);

  const onSubmit = async (data: ChangePasswordDto) => {
    try {
      const res = await onSave(data);
      if (res.success) {
        showToast.success(res.message || 'Password updated successfully!');
        reset();
      } else {
        showToast.error(res.message || 'Failed to update password');
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
      {/* Informational Warning Notice */}
      <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-600/20 text-orange-200 text-xs flex items-start gap-2.5">
        <ShieldAlert size={16} className="text-orange-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px] sm:text-xs">
          Updating your password will revoke all active browser sessions across other devices for
          security.
        </p>
      </div>

      {/* Current Password */}
      <div>
        <label className="block text-xs font-semibold text-white/70 mb-1">
          Current Password <span className="text-orange-500">*</span>
        </label>
        <div className="relative">
          <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type={showCurrent ? 'text' : 'password'}
            placeholder="Enter current password"
            {...register('currentPassword')}
            className={cn(
              'w-full h-9 pl-9 pr-10 rounded-lg bg-zinc-900 border text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors',
              errors.currentPassword
                ? 'border-red-500 focus:border-red-500'
                : 'border-white/12 focus:border-orange-500',
            )}
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
            aria-label={showCurrent ? 'Hide password' : 'Show password'}
          >
            {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-[11px] text-red-400 mt-1">{errors.currentPassword.message}</p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label className="block text-xs font-semibold text-white/70 mb-1">
          New Password <span className="text-orange-500">*</span>
        </label>
        <div className="relative">
          <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type={showNew ? 'text' : 'password'}
            placeholder="Enter new password"
            {...register('newPassword')}
            className={cn(
              'w-full h-9 pl-9 pr-10 rounded-lg bg-zinc-900 border text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors',
              errors.newPassword
                ? 'border-red-500 focus:border-red-500'
                : 'border-white/12 focus:border-orange-500',
            )}
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
            aria-label={showNew ? 'Hide password' : 'Show password'}
          >
            {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-[11px] text-red-400 mt-1">{errors.newPassword.message}</p>
        )}

        {/* Live Password Strength Meter */}
        {newPasswordValue.length > 0 && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white/60 font-medium">Password Strength</span>
              <span className="font-bold text-white tracking-wider">{strengthChecks.label}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={cn('h-full transition-all duration-300', strengthChecks.colorClass)}
                style={{ width: `${strengthChecks.percent}%` }}
              />
            </div>
            {/* Requirements Checklist */}
            <div className="grid grid-cols-2 gap-1 pt-1 text-[10px]">
              <div
                className={cn(
                  'flex items-center gap-1.5',
                  strengthChecks.minLength ? 'text-emerald-400 font-medium' : 'text-white/40',
                )}
              >
                {strengthChecks.minLength ? <Check size={11} /> : <XIcon size={11} />}
                <span>At least 6 characters</span>
              </div>
              <div
                className={cn(
                  'flex items-center gap-1.5',
                  strengthChecks.hasUpper ? 'text-emerald-400 font-medium' : 'text-white/40',
                )}
              >
                {strengthChecks.hasUpper ? <Check size={11} /> : <XIcon size={11} />}
                <span>Uppercase letter (A-Z)</span>
              </div>
              <div
                className={cn(
                  'flex items-center gap-1.5',
                  strengthChecks.hasLower ? 'text-emerald-400 font-medium' : 'text-white/40',
                )}
              >
                {strengthChecks.hasLower ? <Check size={11} /> : <XIcon size={11} />}
                <span>Lowercase letter (a-z)</span>
              </div>
              <div
                className={cn(
                  'flex items-center gap-1.5',
                  strengthChecks.hasNumber ? 'text-emerald-400 font-medium' : 'text-white/40',
                )}
              >
                {strengthChecks.hasNumber ? <Check size={11} /> : <XIcon size={11} />}
                <span>Number (0-9)</span>
              </div>
              <div
                className={cn(
                  'flex items-center gap-1.5 col-span-2',
                  strengthChecks.hasSpecial ? 'text-emerald-400 font-medium' : 'text-white/40',
                )}
              >
                {strengthChecks.hasSpecial ? <Check size={11} /> : <XIcon size={11} />}
                <span>Special character (@$!%*?&)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm New Password */}
      <div>
        <label className="block text-xs font-semibold text-white/70 mb-1">
          Confirm New Password <span className="text-orange-500">*</span>
        </label>
        <div className="relative">
          <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Re-enter new password"
            {...register('confirmNewPassword')}
            className={cn(
              'w-full h-9 pl-9 pr-10 rounded-lg bg-zinc-900 border text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors',
              errors.confirmNewPassword
                ? 'border-red-500 focus:border-red-500'
                : 'border-white/12 focus:border-orange-500',
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.confirmNewPassword && (
          <p className="text-[11px] text-red-400 mt-1">{errors.confirmNewPassword.message}</p>
        )}
      </div>

      {/* Submit Action Bar */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => reset()}
          disabled={!isDirty || isSubmitting}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40 cursor-pointer"
        >
          Cancel
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
          <span>Update Password</span>
        </button>
      </div>
    </form>
  );
});

export default ChangePasswordForm;
