import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X, User, Lock, Sliders, ShieldCheck } from 'lucide-react';
import { Skeleton } from '@components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/features/auth/hook/useAuth';
import PersonalInformationForm from './PersonalInformationForm';
import SecuritySettingsTab from './SecuritySettingsTab';
import AccountDetailsTab from './AccountDetailsTab';
import DangerZoneTab from './DangerZoneTab';
import UnsavedChangesDialog from './UnsavedChangesDialog';
import type { UpdateProfileDto, ChangePasswordDto } from '@snitch/schemas';

export interface AccountSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type SettingsTab = 'profile' | 'security' | 'account' | 'danger';

const SPRING_MODAL = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
  mass: 0.8,
} as const;

export const AccountSettingsModal = memo(function AccountSettingsModal({
  open,
  onClose,
}: AccountSettingsModalProps) {
  const { user, loading } = useAppSelector((state) => state.auth);
  const { handleUpdateProfile, handleChangePassword } = useAuth();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [personalDirty, setPersonalDirty] = useState(false);
  const [passwordDirty, setPasswordDirty] = useState(false);
  const [showUnsavedAlert, setShowUnsavedAlert] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const hasUnsavedChanges = personalDirty || passwordDirty;

  // Lock body scrolling while open
  useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open]);

  const handleRequestClose = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowUnsavedAlert(true);
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, onClose]);

  // Trap ESC key press
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleRequestClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleRequestClose]);

  // Focus trap on mount
  useEffect(() => {
    if (open && modalRef.current) {
      const focusable = modalRef.current.querySelector<HTMLElement>(
        'button, input, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }
  }, [open]);

  const handlePersonalSave = async (data: UpdateProfileDto) => {
    const res = await handleUpdateProfile(data);
    if (res.success) {
      setPersonalDirty(false);
    }
    return res;
  };

  const handlePasswordSave = async (data: ChangePasswordDto) => {
    const res = await handleChangePassword(data);
    if (res.success) {
      setPasswordDirty(false);
    }
    return res;
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-0 sm:p-4 bg-black/10 backdrop-blur-sm overflow-hidden">
          {/* Backdrop overlay — click closes with unsaved check */}
          <motion.div
            key="account-settings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={handleRequestClose}
            className="absolute inset-0 bg-black/50"
            aria-hidden="true"
          />

          {/* Floating Settings Dialog Panel */}
          <motion.div
            key="account-settings-panel"
            ref={modalRef}
            role="dialog"
            aria-label="Account Settings Modal"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={SPRING_MODAL}
            className="relative z-10 flex flex-col sm:flex-row w-full h-full sm:h-[520px] sm:max-w-[700px] bg-zinc-950 border-0 sm:border border-white/12 rounded-none sm:rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.9)] overflow-hidden selection:bg-orange-600 selection:text-white"
          >
            {/* Left Sidebar Navigation (~190px) */}
            <aside className="w-full sm:w-[190px] shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 bg-zinc-900/60 p-3 sm:p-3.5 flex flex-col justify-between">
              <div>
                {/* Header Title & Close Button */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10">
                  <span className="text-xs font-semibold text-white/50 tracking-wider uppercase pl-1">
                    Account Center
                  </span>
                  <button
                    type="button"
                    onClick={handleRequestClose}
                    aria-label="Close modal"
                    className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-orange-500"
                  >
                    <X size={15} strokeWidth={2} />
                  </button>
                </div>

                {/* Tab Navigation Buttons */}
                <nav className="flex sm:flex-col gap-1 mt-3 overflow-x-auto sm:overflow-x-visible pb-1 sm:pb-0 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left shrink-0 sm:w-full relative',
                      activeTab === 'profile'
                        ? 'bg-white/12 text-white shadow-xs font-semibold'
                        : 'text-white/60 hover:text-white hover:bg-white/5',
                    )}
                  >
                    <User
                      size={14}
                      strokeWidth={1.8}
                      className={activeTab === 'profile' ? 'text-orange-400' : 'text-white/40'}
                    />
                    <span>Profile</span>
                    {personalDirty && (
                      <span className="ml-auto size-1.5 rounded-full bg-orange-500" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('security')}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left shrink-0 sm:w-full relative',
                      activeTab === 'security'
                        ? 'bg-white/12 text-white shadow-xs font-semibold'
                        : 'text-white/60 hover:text-white hover:bg-white/5',
                    )}
                  >
                    <ShieldCheck
                      size={14}
                      strokeWidth={1.8}
                      className={activeTab === 'security' ? 'text-emerald-400' : 'text-white/40'}
                    />
                    <span>Security</span>
                    {passwordDirty && (
                      <span className="ml-auto size-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('account')}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left shrink-0 sm:w-full',
                      activeTab === 'account'
                        ? 'bg-white/12 text-white shadow-xs font-semibold'
                        : 'text-white/60 hover:text-white hover:bg-white/5',
                    )}
                  >
                    <Sliders
                      size={14}
                      strokeWidth={1.8}
                      className={activeTab === 'account' ? 'text-indigo-400' : 'text-white/40'}
                    />
                    <span>Account Info</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('danger')}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left shrink-0 sm:w-full mt-2',
                      activeTab === 'danger'
                        ? 'bg-red-500/10 text-red-400 shadow-xs font-semibold'
                        : 'text-red-400/60 hover:text-red-400 hover:bg-red-500/10',
                    )}
                  >
                    <Lock
                      size={14}
                      strokeWidth={1.8}
                      className={activeTab === 'danger' ? 'text-red-400' : 'text-red-400/60'}
                    />
                    <span>Danger Zone</span>
                  </button>
                </nav>
              </div>

              {/* Bottom active session indicator */}
              <div className="hidden sm:flex items-center gap-2 pt-3 border-t border-white/10 pl-1">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span className="text-[10px] font-mono text-white/40 tracking-tight">
                  Encrypted Session
                </span>
              </div>
            </aside>

            {/* Right Settings Content Panel */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-zinc-950">
              {/* Header Bar */}
              <header className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0">
                <h2 className="text-sm font-bold text-white tracking-tight">
                  {activeTab === 'profile' && 'Personal Information'}
                  {activeTab === 'security' && 'Security Settings'}
                  {activeTab === 'account' && 'Account Information'}
                  {activeTab === 'danger' && 'Danger Zone'}
                </h2>
              </header>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin scrollbar-thumb-white/10">
                {loading || !user ? (
                  <div className="flex flex-col gap-3 animate-pulse">
                    <Skeleton className="h-14 w-full rounded-xl bg-white/5" />
                    <Skeleton className="h-10 w-full rounded-lg bg-white/5" />
                    <Skeleton className="h-10 w-full rounded-lg bg-white/5" />
                  </div>
                ) : (
                  <div>
                    {activeTab === 'profile' && (
                      <PersonalInformationForm
                        user={user}
                        onSave={handlePersonalSave}
                        onDirtyChange={setPersonalDirty}
                      />
                    )}

                    {activeTab === 'security' && (
                      <SecuritySettingsTab
                        onPasswordSave={handlePasswordSave}
                        onPasswordDirtyChange={setPasswordDirty}
                      />
                    )}

                    {activeTab === 'account' && <AccountDetailsTab />}

                    {activeTab === 'danger' && <DangerZoneTab onClose={onClose} />}
                  </div>
                )}
              </div>
            </main>
          </motion.div>

          {/* Unsaved Changes Alert Dialog */}
          <UnsavedChangesDialog
            open={showUnsavedAlert}
            onKeepEditing={() => setShowUnsavedAlert(false)}
            onDiscard={() => {
              setShowUnsavedAlert(false);
              setPersonalDirty(false);
              setPasswordDirty(false);
              onClose();
            }}
          />
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
});

export default AccountSettingsModal;
