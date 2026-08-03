/**
 * AdminMobileNav.tsx
 *
 * Mobile-only bottom navigation for Admin dashboard (< lg breakpoint).
 * Desktop sidebar is hidden on mobile; this component takes over.
 *
 * Architecture:
 *   MobileNavItem     — individual pill tab (icon + optional label)
 *   MenuActionItem    — row inside the floating action sheet
 *   MobileMenuSheet   — floating action sheet anchored above the nav bar
 *   AdminMobileNav    — root component, mounts into AdminLayout
 *
 * Motion personality: Premium (Snitch brand)
 *   Signature easing : cubic-bezier(0.4, 0, 0.2, 1)
 *   Spring           : stiffness 400 / damping 32 / no overshoot
 *   Stagger budget   : 35ms per item (Standard pattern, < 400ms total)
 */

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Star,
  Ticket,
  X,
  User,
  TextAlignJustify,
  ChartBarStacked,
  LifeBuoy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/features/auth/state/auth.slice';

// ─── Motion Constants ─────────────────────────────────────────────────────────

/** Primary spring — tight, no overshoot, responsive to touch. */
const SPRING = {
  type: 'spring',
  stiffness: 400,
  damping: 32,
  mass: 0.8,
} as const;

/** Softer spring for sheet entrance — heavier element, slower settle. */
const SPRING_SHEET = {
  type: 'spring',
  stiffness: 320,
  damping: 28,
  mass: 1,
} as const;

/** Premium easing scalar for non-spring transitions. */
const EASE = [0.4, 0, 0.2, 1] as const;

/** Stagger container variant — children inherit delay via staggerChildren. */
const STAGGER_CONTAINER = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
} as const;

/** Each staggered menu row. */
const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
} as const;

// ─── Navigation Config — static, module-level, never recreated ───────────────

interface NavItem {
  readonly label: string;
  readonly to: string;
  readonly icon: React.ElementType;
  readonly end?: boolean;
}

/** Primary tabs shown in the bottom bar — max 3 (4th slot is Menu). */
const PRIMARY_NAV: ReadonlyArray<NavItem> = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Inventory', to: '/admin/inventory', icon: Package },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingCart },
] as const;

/** Secondary actions shown inside the floating menu sheet. */
const MENU_ITEMS: ReadonlyArray<NavItem> = [
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Reviews', to: '/admin/reviews', icon: Star },
  { label: 'Coupons', to: '/admin/coupons', icon: Ticket },
  { label: 'Support', to: '/admin/support', icon: LifeBuoy },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Categories', to: '/admin/categories', icon: ChartBarStacked },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
] as const;

// ─── MobileNavItem ────────────────────────────────────────────────────────────

interface MobileNavItemProps {
  item: NavItem;
  onNavigate?: () => void;
}

const MobileNavItem = memo(function MobileNavItem({ item, onNavigate }: MobileNavItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      aria-label={item.label}
      onClick={onNavigate}
      className="outline-none h-3/4 flex-1 flex justify-center"
    >
      {({ isActive }) => (
        <motion.div
          whileTap={{ scale: 0.9 }}
          transition={SPRING}
          className="relative flex items-center justify-center"
          style={{ minWidth: 44 }}
        >
          {/* ── Ambient: shared layout pill background with liquid glass orange gradient ── */}
          <AnimatePresence>
            {isActive && (
              <motion.span
                layoutId="mobile-nav-pill"
                className={cn(
                  'absolute inset-0 rounded-3xl',
                  'bg-gradient-to-r from-orange-600/40 via-orange-700/50 to-amber-700/45',
                  'border border-t-[rgba(255,255,255,0.4)] border-x-[rgba(255,255,255,0.15)] border-b-transparent',
                  'shadow-[0_6px_24px_rgba(234,88,12,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]',
                )}
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.82 }}
                transition={SPRING}
                style={{ zIndex: 0 }}
              />
            )}
          </AnimatePresence>

          {/* ── Primary: icon + expanding label ── */}
          <motion.div
            layout
            transition={{ ...SPRING, mass: 0.6 }}
            className={cn(
              'relative z-10 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl',
              'select-none cursor-pointer',
            )}
          >
            <Icon
              size={18}
              strokeWidth={isActive ? 2.3 : 1.7}
              className={cn(
                'flex-shrink-0 transition-colors duration-150',
                isActive
                  ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
                  : 'text-[oklch(0.58_0_0)]',
              )}
            />
            {/* Label only visible when active — layout-animated width */}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="overflow-hidden whitespace-nowrap text-[11.5px] font-extrabold tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </NavLink>
  );
});

// ─── MenuActionItem ───────────────────────────────────────────────────────────

interface MenuActionItemProps {
  item: NavItem;
  onNavigate: () => void;
}

const MenuActionItem = memo(function MenuActionItem({ item, onNavigate }: MenuActionItemProps) {
  const Icon = item.icon;

  return (
    <motion.div variants={STAGGER_ITEM} transition={{ ...SPRING, mass: 0.7 }}>
      <NavLink to={item.to} aria-label={item.label} onClick={onNavigate} className="outline-none">
        {({ isActive }) => (
          <motion.div
            whileHover={{ x: 2, backgroundColor: 'oklch(1 0 0 / 0.05)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.14, ease: EASE }}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
              'cursor-pointer select-none',
              'focus-visible:ring-2 focus-visible:ring-orange-500/40',
              isActive
                ? 'bg-orange-800/25 border border-orange-700/40 text-orange-400 font-semibold shadow-xs'
                : 'text-[oklch(0.65_0_0)] hover:text-[oklch(0.95_0_0)]',
            )}
          >
            <Icon
              size={16}
              strokeWidth={isActive ? 2.2 : 1.6}
              className={cn(
                'flex-shrink-0 transition-[stroke-width] duration-150',
                isActive ? 'text-orange-400' : 'text-[oklch(0.55_0_0)]',
              )}
            />
            <span className="text-[13px] font-medium tracking-wide">{item.label}</span>
            {isActive && (
              <motion.span
                layoutId="menu-active-dot"
                className="ml-auto size-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={SPRING}
              />
            )}
          </motion.div>
        )}
      </NavLink>
    </motion.div>
  );
});

// ─── MenuButton ───────────────────────────────────────────────────────────────

interface MenuButtonProps {
  isOpen: boolean;
  isActive: boolean;
  onClick: () => void;
}

const MenuButton = memo(function MenuButton({ isOpen, isActive, onClick }: MenuButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      transition={SPRING}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      className={cn(
        'relative flex-1 h-3/4 flex items-center justify-center outline-none',
        'focus-visible:ring-2 focus-visible:ring-[oklch(0.7_0_0_/0.4)]',
        'rounded-3xl',
      )}
    >
      {/* Orange pill — same layoutId as primary tabs, animates across on menu route active */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            layoutId="mobile-nav-pill"
            className={cn(
              'absolute inset-0 rounded-3xl',
              'bg-orange-800 text-[oklch(0.98_0_0)] shadow-[0_4px_16px_rgba(194,65,12,0.45)]',
            )}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.82 }}
            transition={SPRING}
            style={{ zIndex: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Dark pill — only shown when menu is open AND no menu route is currently active */}
      <AnimatePresence>
        {isOpen && !isActive && (
          <motion.span
            className="absolute inset-0 rounded-3xl bg-[oklch(1_0_0_/_0.08)] border border-[oklch(1_0_0_/_0.12)]"
            initial={{ opacity: 0, scale: 0.84 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.84 }}
            transition={SPRING}
            style={{ zIndex: 0 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10 flex items-center justify-center p-2.5"
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.22, ease: EASE }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, scale: 0.7, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotate: 45 }}
              transition={{ duration: 0.16, ease: EASE }}
            >
              <X
                size={18}
                strokeWidth={isActive ? 2.3 : 2}
                className={cn(
                  'transition-colors duration-150',
                  isActive ? 'text-white' : 'text-[oklch(0.85_0_0)]',
                )}
              />
            </motion.span>
          ) : (
            <motion.span
              key="menu"
              initial={{ opacity: 0, scale: 0.7, rotate: 45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotate: -45 }}
              transition={{ duration: 0.16, ease: EASE }}
            >
              <TextAlignJustify
                size={18}
                strokeWidth={isActive ? 2.3 : 1.7}
                className={cn(
                  'transition-colors duration-150',
                  isActive ? 'text-white' : 'text-[oklch(0.55_0_0)]',
                )}
              />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
});

// ─── MobileMenuSheet ──────────────────────────────────────────────────────────

interface MobileMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenuSheet = memo(function MobileMenuSheet({ isOpen, onClose }: MobileMenuSheetProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
    onClose();
  }, [dispatch, navigate, onClose]);

  const handleProfile = useCallback(() => {
    navigate('/admin/profile');
    onClose();
  }, [navigate, onClose]);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Trap focus inside the sheet when open
  useEffect(() => {
    if (isOpen && sheetRef.current) {
      const firstFocusable = sheetRef.current.querySelector<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop — click outside closes ── */}
          <motion.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          {/* ── Floating action sheet ── */}
          <motion.div
            key="sheet-panel"
            ref={sheetRef}
            role="dialog"
            aria-label="Navigation menu"
            aria-modal="true"
            // Entrance: slide up from bottom + scale from 0.94
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 16,
              scale: 0.96,
              transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
            }}
            transition={SPRING_SHEET}
            className={cn(
              // Position — fixed above the bottom nav with gap
              'fixed z-50 left-4 right-4',
              'bottom-[calc(80px+env(safe-area-inset-bottom)+12px)]',
              // Liquid Glass Surface
              'rounded-3xl overflow-hidden',
              'bg-gradient-to-b from-[oklch(0.18_0.008_260_/_0.92)] via-[oklch(0.13_0.006_260_/_0.96)] to-[oklch(0.09_0.005_260_/_0.98)]',
              'backdrop-blur-3xl saturate-150',
              'border border-t-[rgba(255,255,255,0.22)] border-x-[rgba(255,255,255,0.1)] border-b-[rgba(255,255,255,0.05)]',
              'shadow-[0_32px_80px_rgba(0,0,0,0.95),inset_0_1.5px_1px_rgba(255,255,255,0.2)]',
            )}
          >
            {/* User identity strip */}
            {user && (
              <div className="px-4 pt-4 pb-3 border-b border-[oklch(1_0_0_/_0.06)]">
                <button
                  onClick={handleProfile}
                  className="w-full flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.7_0_0_/_0.3)] rounded-xl p-1 -m-1"
                >
                  <div
                    className={cn(
                      'size-8 rounded-full flex items-center justify-center flex-shrink-0',
                      'bg-[oklch(0.22_0_0)] text-[oklch(0.72_0_0)]',
                      'text-[11px] font-semibold',
                      'ring-1 ring-[oklch(1_0_0_/_0.12)]',
                    )}
                  >
                    {user.firstName?.[0]?.toUpperCase() ?? <User size={12} />}
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[12px] font-semibold text-[oklch(0.88_0_0)] truncate leading-tight">
                      {user.firstName} {user.lastName ?? ''}
                    </p>
                    <p className="text-[10px] text-[oklch(0.44_0_0)] truncate leading-tight mt-0.5">
                      {user.email}
                    </p>
                  </div>
                </button>
              </div>
            )}

            {/* Menu items — staggered entrance */}
            <motion.div
              variants={STAGGER_CONTAINER}
              initial="hidden"
              animate="show"
              className="p-2"
            >
              {MENU_ITEMS.map((item) => (
                <MenuActionItem key={item.to} item={item} onNavigate={onClose} />
              ))}

              {/* Divider */}
              <div className="h-px bg-[oklch(1_0_0_/_0.06)] mx-2 my-1" />

              {/* Logout */}
              <motion.div variants={STAGGER_ITEM} transition={{ ...SPRING, mass: 0.7 }}>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ x: 2, backgroundColor: 'oklch(0.62 0.18 22 / 0.08)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.14, ease: EASE }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl',
                    'cursor-pointer select-none outline-none',
                    'text-[oklch(0.62_0.18_22)]',
                    'focus-visible:ring-2 focus-visible:ring-[oklch(0.62_0.18_22_/_0.4)]',
                  )}
                >
                  <LogOut size={16} strokeWidth={1.6} className="flex-shrink-0" />
                  <span className="text-[13px] font-medium tracking-wide">Logout</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

// ─── AdminMobileNav (Root) ────────────────────────────────────────────────────

export const AdminMobileNav = memo(function AdminMobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // True when the current route belongs to MENU_ITEMS (secondary routes)
  const isMenuRouteActive = useMemo(() => {
    const menuRoutes = [
      ...MENU_ITEMS.map((i) => i.to),
      '/admin/profile',
      '/admin/settings/account',
    ];
    return menuRoutes.some((route) => location.pathname.startsWith(route));
  }, [location.pathname]);

  // Hide bottom navigation on full-page flows (e.g., product creation)
  const isHiddenRoute = useMemo(() => {
    return (
      location.pathname.startsWith('/admin/inventory/create') ||
      location.pathname.startsWith('/admin/inventory/edit') ||
      location.pathname.startsWith('/admin/categories/create') ||
      location.pathname.startsWith('/admin/categories/edit')
    );
  }, [location.pathname]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (isHiddenRoute) {
    return null;
  }

  return (
    <>
      <MobileMenuSheet isOpen={menuOpen} onClose={closeMenu} />

      {/* ── Bottom navigation bar ── */}
      <motion.nav
        role="navigation"
        aria-label="Mobile admin navigation"
        // Mount animation — slides up from bottom once on load
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, ...SPRING }}
        className={cn(
          // Positioning
          'fixed bottom-0 left-0 right-0 z-50',
          // Safe area — iPhone home bar support
          'pb-[env(safe-area-inset-bottom)]',
          // Container
          'px-3',
        )}
      >
        {/* Liquid Glass Pill Container */}
        <div
          className={cn(
            'flex items-center h-18 px-2',
            'mx-auto max-w-sm',
            'rounded-full overflow-hidden',
            'bg-gradient-to-b from-[oklch(0.18_0.008_260_/0.6)] via-[oklch(0.11_0.005_260_/0.7)] to-[oklch(0.07_0.005_260_/0.5)]',
            'backdrop-blur-md saturate-150',
            'border border-t-[rgba(255,255,255,0.25)] border-x-[rgba(255,255,255,0.12)] border-b-[rgba(255,255,255,0.06)]',
            'shadow-[0_20px_60px_rgba(0,0,0,0.9),inset_0_1.5px_1px_rgba(255,255,255,0.25),inset_0_-1px_1px_rgba(0,0,0,0.5)]',
            'mb-2.5',
          )}
        >
          {/* Primary nav items */}
          {PRIMARY_NAV.map((item) => (
            <MobileNavItem key={item.to} item={item} onNavigate={closeMenu} />
          ))}

          {/* Divider */}
          <div className="w-px h-6 bg-[oklch(1_0_0_/0.08)] shrink-0" />

          {/* Menu trigger */}
          <MenuButton
            isOpen={menuOpen}
            isActive={isMenuRouteActive}
            onClick={menuOpen ? closeMenu : openMenu}
          />
        </div>
      </motion.nav>
    </>
  );
});

export default AdminMobileNav;
