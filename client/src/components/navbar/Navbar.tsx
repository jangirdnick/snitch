/**
 * Navbar — Premium Fashion Navigation
 *
 * Design language matches the Hero section exactly:
 *  – Transparent over hero (full bleed into the dark gallery)
 *  – On scroll: dark glassmorphic background with subtle border
 *  – Logo & links in white — same palette as the hero wordmark
 *  – Motion: entrance fade-in, hover underline, mobile drawer with stagger
 *
 * Accessibility:
 *  – role="banner", aria-label on nav
 *  – aria-expanded on hamburger, aria-hidden on decorative dividers
 *  – Focus-visible rings on all interactive elements
 *  – prefers-reduced-motion respected via Motion's system
 */

import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Search,
  Heart,
  ShoppingBag,
  Settings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/features/auth/hook/useAuth';
import type { AuthState } from '@/features/auth/state/auth.slice';
import { UserProfileModal } from '@/components/profile';
import { AccountSettingsModal } from '@/components/account-settings';

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'New In', href: '/new-in' },
  { label: 'Men', href: '/men' },
  { label: 'Women', href: '/women' },
  { label: 'Accessories', href: '/accessories' },
  { label: 'Sale', href: '/sale', accent: true },
];

/** Premium easing — matches Hero section's motion language */
const EASE = [0.25, 0.46, 0.45, 0.94] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Generic circular icon button */
function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center w-9 h-9 rounded-full',
        'text-white/70 transition-all duration-300',
        'hover:text-white hover:bg-white/10 active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
      )}
    >
      {children}
    </button>
  );
}

/**
 * ProfileDropdown - Premium authenticated user menu
 * Handles both User and Admin states with distinguishable styling
 */

// import { UserProfileModal } from '@/components/profile';

type ProfileDropdownProps = {
  user: AuthState['user'];
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
};

function ProfileDropdown({ user, onLogout, onOpenProfile, onOpenSettings }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="User profile menu"
        className={cn(
          'relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300',
          'hover:bg-white/10 active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
          isAdmin && 'shadow-[0_0_12px_rgba(255,255,255,0.06)] bg-white/5',
        )}
      >
        {/* Avatar or fallback icon */}
        <div className="relative w-7.5 h-7.5 rounded-full overflow-hidden flex items-center justify-center bg-white/10">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.firstName || 'Profile'}
              loading="lazy"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={15} strokeWidth={1.5} className="text-white/70" />
          )}
        </div>
        {/* Online indicator */}
        <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-400 border border-[#08060d]" />
        {/* Admin accent ring */}
        {isAdmin && <div className="absolute inset-0 rounded-full ring-1 ring-white/20" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden',
              'bg-[rgba(15,13,20,0.95)] backdrop-blur-3xl border border-white/10',
              'shadow-[0_10px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]',
            )}
          >
            {/* Header info in dropdown */}
            <div className="px-4 py-4 border-b border-white/10 bg-white/2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 shrink-0 border border-white/5 relative">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={18} strokeWidth={1.5} className="text-white/80" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-white truncate w-full">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-[11px] text-white/50 truncate w-full text-left">
                    {user?.email}
                  </span>
                </div>
              </div>
              {isAdmin && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/10 border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white">
                    Admin Privileges
                  </span>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="p-1.5 flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenProfile();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-white/70 transition-colors hover:text-white hover:bg-white/10 w-full text-left cursor-pointer"
              >
                <User size={16} strokeWidth={1.5} />
                Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenSettings();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-white/70 transition-colors hover:text-white hover:bg-white/10 w-full text-left cursor-pointer"
              >
                <Settings size={16} strokeWidth={1.5} />
                Account Settings
              </button>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-white/70 transition-colors hover:text-white hover:bg-white/10"
                >
                  <LayoutDashboard size={16} strokeWidth={1.5} />
                  Dashboard
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="flex items-center gap-2.5 px-3 py-2 mt-1 rounded-xl text-sm font-medium text-red-400 transition-colors hover:bg-red-400/10 hover:text-red-300 w-full text-left"
              >
                <LogOut size={16} strokeWidth={1.5} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { handleLogout } = useAuth();

  /* Scroll listener — passive for performance */
  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll while mobile menu is open */
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  function openAuthModal(mode: 'login' | 'register') {
    setMobileOpen(false);
    navigate(`/${mode}`, { state: { background: location } });
  }

  return (
    <>
      {/* ── Header bar ───────────────────────────────────────────────────── */}
      <motion.header
        role="banner"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-100 h-16',
          'transition-all duration-500',
          scrolled
            ? [
                'bg-[rgba(8,6,13,0.88)]',
                'backdrop-blur-2xl',
                'border-b border-white/[0.07]',
                'shadow-[0_1px_0_0_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.4)]',
              ]
            : 'bg-transparent border-b border-transparent',
        )}
      >
        <div className="w-full mx-auto h-full flex items-center px-5 sm:px-6 relative">
          {/* Logo */}
          <Link
            to="/"
            aria-label="Snitch home"
            className={cn(
              'shrink-0 z-10',
              'transition-opacity duration-150 hover:opacity-70',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm',
            )}
          >
            <img src="./SNITCH_LOGO_NEW_BLACK.webp" alt="Snitch Logo" className="w-20 invert" />
          </Link>

          {/* Desktop Nav Links — absolutely centered in header */}
          <nav
            className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-0"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative px-4 py-2 text-[11px] font-medium tracking-[0.14em] uppercase transition-colors duration-300',
                    link.accent
                      ? 'text-red-400 hover:text-red-300'
                      : isActive
                        ? 'text-white'
                        : 'text-white/45 hover:text-white',
                  )}
                >
                  {link.label}
                  {isActive && !link.accent && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-px bg-white/60"
                      transition={{ duration: 0.35, ease: EASE }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-0.5 ml-auto z-10">
            {/* Desktop Storefront Icons */}
            <div className="hidden sm:flex items-center gap-0.5 mr-2">
              <IconButton label="Search">
                <Search size={18} strokeWidth={1.5} />
              </IconButton>
              <IconButton label="Wishlist">
                <Heart size={18} strokeWidth={1.5} />
              </IconButton>
              <IconButton label="Cart">
                <ShoppingBag size={18} strokeWidth={1.5} />
              </IconButton>
            </div>

            <div className="w-px h-4 bg-white/15 mx-1.5 hidden sm:block" />

            {/* Auth — hidden on mobile (shown in drawer) */}
            <div className="hidden sm:flex items-center gap-2 ml-1">
              {isAuthenticated ? (
                <>
                  <ProfileDropdown
                    user={user}
                    onLogout={handleLogout}
                    onOpenProfile={() => setProfileOpen(true)}
                    onOpenSettings={() => setAccountSettingsOpen(true)}
                  />
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className={cn(
                      'text-[11px] font-medium tracking-widest uppercase text-white/55',
                      'px-3 py-1.5 rounded-full transition-colors duration-150',
                      'hover:text-white hover:bg-white/8',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                    )}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal('register')}
                    className={cn(
                      'text-[11px] font-semibold tracking-widest uppercase',
                      'h-8 px-4 rounded-full',
                      'bg-white text-[#08060d]',
                      'transition-all duration-200',
                      'hover:bg-white/90 hover:shadow-[0_2px_16px_rgba(255,255,255,0.15)]',
                      'active:scale-[0.97]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
                    )}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <motion.button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
              onClick={() => setMobileOpen((v) => !v)}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'lg:hidden flex items-center justify-center w-9 h-9 rounded-full ml-1',
                'text-white/70 hover:text-white hover:bg-white/10',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18, ease: EASE }}
                  >
                    <X size={20} strokeWidth={1.5} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18, ease: EASE }}
                  >
                    <Menu size={20} strokeWidth={1.5} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile full-screen drawer ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className={cn(
              'fixed inset-0 z-99 lg:hidden',
              'bg-[rgba(8,6,13,0.97)] backdrop-blur-2xl',
              'flex flex-col pt-20 pb-10 px-6 overflow-y-auto',
            )}
          >
            {/* Nav links — staggered entrance */}
            <nav aria-label="Mobile navigation" className="flex flex-col gap-0">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: EASE, delay: 0.05 + i * 0.06 }}
                >
                  <Link
                    to={link.href}
                    className={cn(
                      'block py-4 text-3xl font-bold tracking-[-0.02em]',
                      'border-b border-white/8',
                      'transition-colors duration-150',
                      link.accent
                        ? 'text-red-400 hover:text-red-300'
                        : location.pathname === link.href
                          ? 'text-white'
                          : 'text-white/50 hover:text-white',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                    )}
                    aria-current={location.pathname === link.href ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile Storefront Icons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.3 }}
              className="mt-8 flex gap-4"
            >
              <IconButton label="Search">
                <Search size={22} strokeWidth={1.5} />
              </IconButton>
              <IconButton label="Wishlist">
                <Heart size={22} strokeWidth={1.5} />
              </IconButton>
              <IconButton label="Cart">
                <ShoppingBag size={22} strokeWidth={1.5} />
              </IconButton>
            </motion.div>

            {/* Mobile auth — bottom */}
            {!isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.38 }}
                className="mt-auto flex flex-col gap-3 pt-8"
              >
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className={cn(
                    'w-full h-12 rounded-full',
                    'bg-white text-[#08060d] text-sm font-semibold tracking-[0.08em] uppercase',
                    'transition-all duration-200 hover:bg-white/90 active:scale-[0.98]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
                  )}
                >
                  Create account
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className={cn(
                    'w-full h-12 rounded-full',
                    'border border-white/20 text-white text-sm font-medium tracking-[0.08em] uppercase',
                    'transition-all duration-200 hover:border-white/40 hover:bg-white/5 active:scale-[0.98]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                  )}
                >
                  Sign in
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.38 }}
                className="mt-auto pt-8 flex flex-col gap-3"
              >
                <div className="flex items-center gap-4 px-3 py-3 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                  <div className="relative w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0 border border-white/5 z-10">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.firstName}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={22} strokeWidth={1.5} className="text-white/70" />
                    )}
                    <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#08060d]" />
                  </div>
                  <div className="flex flex-col z-10">
                    <span className="text-white font-medium tracking-wide">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-white/50 text-xs truncate max-w-37.5">{user?.email}</span>
                  </div>
                  {user?.role === 'ADMIN' && (
                    <div className="ml-auto px-2 py-1 rounded-md bg-white/10 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white z-10">
                      Admin
                    </div>
                  )}
                  {user?.role === 'ADMIN' && (
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 blur-[50px] pointer-events-none" />
                  )}
                </div>

                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'w-full h-12 flex items-center justify-center gap-2 rounded-full',
                      'bg-white/10 text-white text-sm font-medium tracking-[0.08em] uppercase',
                      'transition-all duration-200 hover:bg-white/20 active:scale-[0.98]',
                    )}
                  >
                    <LayoutDashboard size={18} strokeWidth={1.5} />
                    Dashboard
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className={cn(
                    'w-full h-12 rounded-full flex justify-center items-center gap-2',
                    'border border-white/15 text-white/60 text-sm font-medium tracking-[0.08em] uppercase',
                    'transition-all duration-200 hover:text-red-400 hover:border-red-500/30 active:scale-[0.98]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                  )}
                >
                  <LogOut size={18} strokeWidth={1.5} />
                  Sign out
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <UserProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <AccountSettingsModal
        open={accountSettingsOpen}
        onClose={() => setAccountSettingsOpen(false)}
      />
    </>
  );
}
