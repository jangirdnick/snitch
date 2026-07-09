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
import { ShoppingBag, Heart, Search, Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/features/auth/hook/useAuth';

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

/** Circular icon button — matches hero CTA ghost style */
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
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center w-9 h-9 rounded-full',
        'text-white/60 transition-colors duration-150',
        'hover:text-white hover:bg-white/10',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
        'active:scale-95',
      )}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
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

  /* Close drawer on route change */
  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* Lock body scroll while mobile menu is open */
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  function openAuthModal(mode: 'login' | 'register') {
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
        <div className="w-full mx-auto h-full flex items-center px-5 sm:px-6 gap-8">
          {/* Logo */}
          <Link
            to="/"
            aria-label="Snitch home"
            className={cn(
              'shrink-0 text-[15px] font-bold tracking-[0.22em] uppercase text-white',
              'transition-opacity duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm',
            )}
          >
            <img src="./SNITCH_LOGO_NEW_BLACK.webp" className="w-20 invert" />
          </Link>

          {/* Desktop nav links — centered */}
          {/* <nav
            className="hidden lg:flex flex-1 items-center justify-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={location.pathname === link.href}
                accent={link.accent}
              />
            ))}
          </nav> */}

          {/* Right actions */}
          <div className="flex items-center gap-0.5 ml-auto">
            {/* Icon buttons — always visible */}
            <IconButton label="Search">
              <Search size={18} strokeWidth={1.5} />
            </IconButton>
            <IconButton label="Wishlist">
              <Heart size={18} strokeWidth={1.5} />
            </IconButton>
            <IconButton label="Cart">
              <ShoppingBag size={18} strokeWidth={1.5} />
            </IconButton>

            {/* Auth — hidden on mobile (shown in drawer) */}
            <div className="hidden sm:flex items-center gap-2 ml-1">
              {isAuthenticated ? (
                <>
                  <IconButton label={`Signed in as ${user?.firstName ?? 'you'}`}>
                    <User size={18} strokeWidth={1.5} />
                  </IconButton>
                  <IconButton label="Sign out" onClick={handleLogout}>
                    <LogOut size={18} strokeWidth={1.5} />
                  </IconButton>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    id="navbar-login-btn"
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
                    id="navbar-register-btn"
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

            {/* Mobile auth — bottom */}
            {!isAuthenticated && (
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
            )}

            {/* Authenticated mobile actions */}
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.38 }}
                className="mt-auto pt-8 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3 px-1 py-2">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                    <User size={18} strokeWidth={1.5} className="text-white/70" />
                  </div>
                  <span className="text-white/60 text-sm tracking-wide">{user?.firstName}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={cn(
                    'w-full h-12 rounded-full',
                    'border border-white/15 text-white/60 text-sm font-medium tracking-[0.08em] uppercase',
                    'transition-all duration-200 hover:border-white/30 hover:text-white active:scale-[0.98]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                  )}
                >
                  Sign out
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
