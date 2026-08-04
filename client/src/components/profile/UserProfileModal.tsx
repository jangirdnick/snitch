import { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X, User, ShieldCheck, History } from 'lucide-react';
import { Skeleton } from '@components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { ProfileAvatarCard } from './ProfileAvatarCard';
import { ProfileDetailsCard } from './ProfileDetailsCard';
import { ProfileActivityCard } from './ProfileActivityCard';
import { RoleBadge, AccountStatusBadge, VerificationBadge } from './ProfileStatusBadges';

export interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
}

type TabType = 'account' | 'security' | 'activity';

const SPRING_MODAL = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
  mass: 0.8,
} as const;

export const UserProfileModal = memo(function UserProfileModal({
  open,
  onClose,
}: UserProfileModalProps) {
  const { user, loading } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Trap ESC key press
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Focus trap on mount
  useEffect(() => {
    if (open && modalRef.current) {
      const focusable = modalRef.current.querySelector<HTMLElement>(
        'button, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }
  }, [open]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-hidden">
          {/* Backdrop overlay — click closes */}
          <motion.div
            key="profile-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
            aria-hidden="true"
          />

          {/* Floating Settings Dialog Panel */}
          <motion.div
            key="profile-modal-panel"
            ref={modalRef}
            role="dialog"
            aria-label="Account Settings"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={SPRING_MODAL}
            className="relative z-10 flex flex-col sm:flex-row w-full max-w-[700px] h-[520px] sm:h-[480px] bg-zinc-950 border border-white/12 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.9)] overflow-hidden selection:bg-orange-600 selection:text-white"
          >
            {/* Left Sidebar Navigation (~190px) */}
            <aside className="w-full sm:w-[190px] shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 bg-zinc-900/60 p-3 sm:p-3.5 flex flex-col justify-between">
              <div>
                {/* Close Button Top Left */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10">
                  <span className="text-xs font-semibold text-white/50 tracking-wider uppercase pl-1">
                    Settings
                  </span>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-orange-500"
                  >
                    <X size={15} strokeWidth={2} />
                  </button>
                </div>

                {/* Tab Menu List */}
                <nav className="flex sm:flex-col gap-1 mt-3 overflow-x-auto sm:overflow-x-visible pb-1 sm:pb-0 scrollbar-none">
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
                    <User
                      size={14}
                      strokeWidth={1.8}
                      className={activeTab === 'account' ? 'text-orange-400' : 'text-white/40'}
                    />
                    <span>Account</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('security')}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left shrink-0 sm:w-full',
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
                    <span>Security & Role</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('activity')}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left shrink-0 sm:w-full',
                      activeTab === 'activity'
                        ? 'bg-white/12 text-white shadow-xs font-semibold'
                        : 'text-white/60 hover:text-white hover:bg-white/5',
                    )}
                  >
                    <History
                      size={14}
                      strokeWidth={1.8}
                      className={activeTab === 'activity' ? 'text-indigo-400' : 'text-white/40'}
                    />
                    <span>Activity Log</span>
                  </button>
                </nav>
              </div>

              {/* Bottom active status indicator */}
              <div className="hidden sm:flex items-center gap-2 pt-3 border-t border-white/10 pl-1">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-white/40 tracking-tight">
                  Session Active
                </span>
              </div>
            </aside>

            {/* Right Settings Content Panel */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-zinc-950">
              {/* Header Title Bar */}
              <header className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0">
                <h2 className="text-sm font-bold text-white tracking-tight">
                  {activeTab === 'account' && 'Account Settings'}
                  {activeTab === 'security' && 'Security & Access Control'}
                  {activeTab === 'activity' && 'System Activity & Audit'}
                </h2>
              </header>

              {/* Settings Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin scrollbar-thumb-white/10">
                {loading || !user ? (
                  <div className="flex flex-col gap-3 animate-pulse">
                    <Skeleton className="h-14 w-full rounded-xl bg-white/5" />
                    <Skeleton className="h-10 w-full rounded-lg bg-white/5" />
                    <Skeleton className="h-10 w-full rounded-lg bg-white/5" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Tab 1: Account */}
                    {activeTab === 'account' && (
                      <>
                        <ProfileAvatarCard user={user} />
                        <div className="mt-1">
                          <ProfileDetailsCard user={user} />
                        </div>
                      </>
                    )}

                    {/* Tab 2: Security */}
                    {activeTab === 'security' && (
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between py-3 border-b border-white/10 text-xs sm:text-[13px]">
                          <span className="text-white/60 font-medium">Assigned System Role</span>
                          <RoleBadge role={user.role} />
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-white/10 text-xs sm:text-[13px]">
                          <span className="text-white/60 font-medium">
                            Account Operational Status
                          </span>
                          <AccountStatusBadge />
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-white/10 text-xs sm:text-[13px]">
                          <span className="text-white/60 font-medium">
                            Email Verification Status
                          </span>
                          <VerificationBadge emailVerified={user.emailVerified} />
                        </div>
                      </div>
                    )}

                    {/* Tab 3: Activity */}
                    {activeTab === 'activity' && <ProfileActivityCard user={user} />}
                  </div>
                )}
              </div>
            </main>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
});

export default UserProfileModal;
