import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deleteAccountSchema } from '@snitch/schemas';
import { useAuth } from '@/features/auth/hook/useAuth';
import { useAppSelector } from '@/store/hooks';
import { AlertTriangle, LogOut, Trash2, Loader2, Lock } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { setFormErrors } from '@/utils/form-errors.util';
import { AxiosError } from 'axios';

interface DangerZoneTabProps {
  onClose: () => void;
}

export const DangerZoneTab = memo(function DangerZoneTab({ onClose }: DangerZoneTabProps) {
  const { user } = useAppSelector((state) => state.auth);
  const { handleLogout, handleLogoutAllDevices, handleDeleteAccount } = useAuth();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<{ password: string }>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: '' },
  });

  const onLogout = async () => {
    setIsLoggingOut(true);
    const success = await handleLogout();
    setIsLoggingOut(false);
    if (success) onClose();
  };

  const onLogoutAll = async () => {
    setIsLoggingOutAll(true);
    const success = await handleLogoutAllDevices();
    setIsLoggingOutAll(false);
    if (success) onClose();
  };

  const onDeleteSubmit = async (data: { password: string }) => {
    const res = await handleDeleteAccount(data);
    if (res.success) {
      showToast.success('Your account has been deleted');
      onClose();
    } else {
      const errMessage =
        res.error instanceof Error ? res.error.message || res.message : 'Failed to delete account';
      showToast.error(errMessage);
      if (res.error && res.error instanceof AxiosError) {
        const fields = res.error.response?.data?.error?.fields;
        if (fields) setFormErrors(fields, setError);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Informational Warning Notice */}
      <div className="p-3 rounded-xl bg-red-950/30 border border-red-600/20 text-red-200 text-xs flex items-start gap-2.5">
        <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px] sm:text-xs">
          The actions in this section are destructive and cannot be easily reversed. Please proceed
          with caution.
        </p>
      </div>

      {/* Logout Actions */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <LogOut size={16} className="text-white/60" />
          <h3 className="text-sm font-semibold text-white">Session Management</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="p-4 rounded-xl border border-white/10 bg-zinc-900/40 space-y-3">
            <div>
              <p className="text-xs font-semibold text-white">Logout</p>
              <p className="text-[11px] text-white/50 mt-1">
                Sign out of your account on this device only.
              </p>
            </div>
            <button
              onClick={onLogout}
              disabled={isLoggingOut}
              className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoggingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
              Sign Out
            </button>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-zinc-900/40 space-y-3">
            <div>
              <p className="text-xs font-semibold text-white">Logout All Devices</p>
              <p className="text-[11px] text-white/50 mt-1">
                Sign out from everywhere, including this device.
              </p>
            </div>
            <button
              onClick={onLogoutAll}
              disabled={isLoggingOutAll}
              className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoggingOutAll ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <LogOut size={14} />
              )}
              Sign Out Everywhere
            </button>
          </div>
        </div>
      </section>

      {/* Delete Account */}
      {user?.role !== 'ADMIN' && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-red-500/20">
            <Trash2 size={16} className="text-red-400" />
            <h3 className="text-sm font-semibold text-red-400">Delete Account</h3>
          </div>

          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-4">
            <div>
              <p className="text-xs font-semibold text-white">Permanently delete your account</p>
              <p className="text-[11px] text-white/60 mt-1 leading-relaxed">
                Once you delete your account, there is no going back. All your personal data will be
                permanently removed. Your past orders will be anonymized for financial records.
              </p>
            </div>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-sm shadow-red-500/20"
              >
                Delete Account
              </button>
            ) : (
              <form
                onSubmit={handleSubmit(onDeleteSubmit)}
                className="space-y-3 p-3 bg-black/20 rounded-lg border border-red-500/10"
              >
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1.5">
                    Confirm by entering your password
                  </label>
                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    />
                    <input
                      type="password"
                      placeholder="Your password"
                      {...register('password')}
                      className={cn(
                        'w-full h-9 pl-9 pr-3 rounded-lg bg-zinc-900 border text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors',
                        errors.password
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-white/12 focus:border-red-500',
                      )}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-red-400 mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      reset();
                    }}
                    disabled={isSubmitting}
                    className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40 cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex justify-center items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-sm shadow-red-500/20"
                  >
                    {isSubmitting ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                    Confirm Deletion
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      )}
    </div>
  );
});

export default DangerZoneTab;
