import { memo, useCallback, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { motion, AnimatePresence, useAnimationControls } from 'motion/react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Ticket,
  BarChart3,
  Settings,
  LogOut,
  Crown,
  User,
  ChartBarStacked,
  LifeBuoy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/features/auth/state/auth.slice';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';

// ─── Motion Variants — Premium easing (0.4, 0, 0.2, 1) ──────────────────────

const SPRING = { type: 'spring', stiffness: 380, damping: 30 } as const;

const navItemVariants = {
  rest: { scale: 1, opacity: 1 },
  hover: { scale: 1.06, opacity: 1 },
  tap: { scale: 0.94, opacity: 1 },
} as const;

const tooltipVariants = {
  hidden: { opacity: 0, x: -6, scale: 0.96 },
  show: { opacity: 1, x: 0, scale: 1 },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItem {
  readonly label: string;
  readonly to: string;
  readonly icon: React.ElementType;
}

// ─── Navigation Config — static, never recreated ─────────────────────────────

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Inventory', to: '/admin/inventory', icon: Package },
  // { label: 'Products', to: '/admin/products', icon: ShoppingBag },
  { label: 'Categories', to: '/admin/categories', icon: ChartBarStacked },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Reviews', to: '/admin/reviews', icon: Star },
  { label: 'Coupons', to: '/admin/coupons', icon: Ticket },
  { label: 'Support', to: '/admin/support', icon: LifeBuoy },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
] as const;

// ─── SidebarTooltipContent — shared premium tooltip ──────────────────────────

function SidebarTooltipContent({ children }: { children: React.ReactNode }) {
  return (
    <TooltipContent
      side="right"
      sideOffset={10}
      className={cn(
        'z-50 select-none rounded-xl px-2.5 py-1 pl-4',
        // 'bg-[oklch(0.20_0.005_264)] text-[oklch(0.92_0_0)] text-xs font-medium tracking-wide',
        'bg-white/70 backdrop-blur-sm  text-[11px] font-medium tracking-wide',
        'border border-gray-100/20',
        'shadow-[0_8px_24px_oklch(0_0_0_/0.08)]',
        // Override shadcn default animation with our own via motion
        '!animate-none',
      )}
    >
      <motion.div
        variants={tooltipVariants}
        initial="hidden"
        animate="show"
        exit="hidden"
        transition={{ duration: 0.14, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </TooltipContent>
  );
}

// ─── SidebarNavItem ───────────────────────────────────────────────────────────

interface SidebarNavItemProps {
  item: NavItem;
}

const SidebarNavItem = memo(function SidebarNavItem({ item }: SidebarNavItemProps) {
  const Icon = item.icon;
  const iconControls = useAnimationControls();

  const handleHoverStart = useCallback(() => {
    void iconControls.start({
      rotate: [0, -15, 12, -8, 0],
      scale: [1, 1.15, 0.95, 1.05, 1],
      transition: { duration: 0.38, ease: [0.4, 0, 0.2, 1], times: [0, 0.25, 0.55, 0.8, 1] },
    });
  }, [iconControls]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NavLink
          to={item.to}
          aria-label={item.label}
          end={item.to === '/admin/dashboard'}
          className="outline-none"
        >
          {({ isActive }) => (
            <AnimatePresence>
              <motion.div
                role="listitem"
                aria-current={isActive ? 'page' : undefined}
                variants={navItemVariants}
                initial={{ scale: 0.8 }}
                whileHover="hover"
                whileTap="tap"
                transition={SPRING}
                onHoverStart={handleHoverStart}
                className={cn(
                  'relative flex size-10 items-center justify-center rounded-xl',
                  'cursor-pointer select-none',
                  'focus-visible:ring-2 focus-visible:ring-[oklch(0.7_0_0_/0.4)] focus-visible:ring-offset-2',
                  'focus-visible:ring-offset-[oklch(0.12_0_0)]',
                  isActive
                    ? 'text-[oklch(0.12_0_0)] shadow-[0_2px_12px_oklch(0.96_0_0_/0.15)]'
                    : 'bg-transparent text-[oklch(0.55_0_0)] hover:bg-[oklch(1_0_0_/0.06)] hover:text-[oklch(0.82_0_0)]',
                )}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-bg"
                      className="absolute inset-0 rounded-xl bg-orange-600"
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.88 }}
                      transition={SPRING}
                      style={{ zIndex: 0 }}
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      className="absolute -left-3.5 top-1/2 h-4 w-1.25 rounded-r-full bg-orange-600"
                      initial={{ opacity: 0, scaleY: 0, y: '-50%' }}
                      animate={{ opacity: 1, scaleY: 1, y: '-50%' }}
                      exit={{ opacity: 0, scaleY: 0, y: '-50%' }}
                      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      style={{ zIndex: 1, transformOrigin: 'center' }}
                    />
                  )}
                </AnimatePresence>

                <motion.div animate={iconControls} className="relative z-10">
                  <Icon
                    size={17}
                    strokeWidth={isActive ? 2 : 1.6}
                    className="transition-[stroke-width] duration-200 block"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </NavLink>
      </TooltipTrigger>
      <SidebarTooltipContent>{item.label}</SidebarTooltipContent>
    </Tooltip>
  );
});

// ─── SidebarLogo ─────────────────────────────────────────────────────────────

const SidebarLogo = memo(function SidebarLogo() {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate('/admin/dashboard');
  }, [navigate]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          onClick={handleClick}
          aria-label="Go to Admin Dashboard"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={SPRING}
          className={cn(
            'flex size-7.5 items-center justify-center rounded-xl outline-none',
            'cursor-pointer select-none',
            'focus-visible:ring-2 focus-visible:ring-[oklch(0.7_0_0_/0.4)] focus-visible:ring-offset-2',
            'focus-visible:ring-offset-[oklch(0.12_0_0)]',
          )}
        >
          {/* <span
            className={cn(
              'flex size-9 items-center justify-center rounded-xl',
              'bg-[oklch(0.96_0_0)] text-[oklch(0.10_0_0)]',
              'text-[14px] font-black tracking-tighter leading-none select-none',
              'shadow-[0_2px_16px_oklch(0.96_0_0_/_0.18),0_0_0_1px_oklch(0.96_0_0_/_0.15)]',
            )}
          >
            S
          </span> */}
          <img src="/SNITCH_SHORT_LOGO.webp" alt="" className=" rounded-md" />
        </motion.button>
      </TooltipTrigger>
      <SidebarTooltipContent>Snitch Admin</SidebarTooltipContent>
    </Tooltip>
  );
});

// ─── SidebarIconButton ───────────────────────────────────────────────────────

interface SidebarIconButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  isActive?: boolean;
  children: React.ReactNode;
}

const SidebarIconButton = memo(function SidebarIconButton({
  isActive,
  className,
  children,
  ...props
}: SidebarIconButtonProps) {
  return (
    <motion.button
      variants={navItemVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      transition={SPRING}
      className={cn(
        'relative flex size-10 items-center justify-center rounded-xl outline-none',
        'cursor-pointer select-none',
        'focus-visible:ring-2 focus-visible:ring-[oklch(0.7_0_0_/0.4)] focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[oklch(0.12_0_0)]',
        isActive
          ? 'bg-[oklch(0.96_0_0)] text-[oklch(0.12_0_0)]'
          : 'bg-transparent text-[oklch(0.45_0_0)] hover:bg-[oklch(1_0_0_/0.06)] hover:text-[oklch(0.72_0_0)]',
        className,
      )}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
});

// ─── SidebarSettings ─────────────────────────────────────────────────────────

const SidebarSettings = memo(function SidebarSettings() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NavLink to="/admin/settings" aria-label="Settings" className="outline-none">
          {({ isActive }) => (
            <motion.div
              animate={{ rotate: isActive ? 45 : 0 }}
              whileHover={{ rotate: 45 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <SidebarIconButton
                id="admin-sidebar-settings"
                aria-current={isActive ? 'page' : undefined}
                isActive={isActive}
              >
                <Settings size={17} strokeWidth={isActive ? 2 : 1.6} />
              </SidebarIconButton>
            </motion.div>
          )}
        </NavLink>
      </TooltipTrigger>
      <SidebarTooltipContent>Settings</SidebarTooltipContent>
    </Tooltip>
  );
});

// ─── SidebarProfile ──────────────────────────────────────────────────────────

const SidebarProfile = memo(function SidebarProfile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const initials = useMemo(() => {
    if (!user) return null;
    const f = user.firstName?.[0] ?? '';
    const l = user.lastName?.[0] ?? '';
    return (f + l).toUpperCase() || null;
  }, [user]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleProfile = useCallback(() => {
    navigate('/admin/profile');
  }, [navigate]);

  const handleAccountSettings = useCallback(() => {
    navigate('/admin/settings/account');
  }, [navigate]);

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <SidebarIconButton aria-label="Open profile menu">
              <Avatar
                className={cn(
                  'size-7 transition-shadow duration-200',
                  'ring-1 ring-[oklch(1_0_0_/0.12)]',
                )}
              >
                <AvatarImage src={undefined} alt={user?.firstName ?? 'User'} />
                <AvatarFallback className="bg-[oklch(0.22_0_0)] text-[oklch(0.72_0_0)] text-[10px] font-semibold">
                  {initials ?? (
                    <Crown size={11} strokeWidth={1.8} className="text-[oklch(0.55_0_0)]" />
                  )}
                </AvatarFallback>
              </Avatar>
            </SidebarIconButton>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <SidebarTooltipContent>
          {user ? `${user.firstName} ${user.lastName ?? ''}` : 'Profile'}
        </SidebarTooltipContent>
      </Tooltip>

      <DropdownMenuContent
        side="right"
        align="end"
        sideOffset={12}
        className={cn(
          'z-50 min-w-48 rounded-xl p-1.5',
          'bg-[oklch(0.15_0.005_264_/0.96)] backdrop-blur-2xl',
          'border border-[oklch(1_0_0_/0.09)]',
          'shadow-[0_24px_64px_oklch(0_0_0_/0.65),0_0_0_1px_oklch(1_0_0_/0.05)]',
          'duration-150',
        )}
      >
        {user && (
          <>
            <DropdownMenuLabel className="px-2.5 py-2">
              <p className="text-[11px] font-semibold text-[oklch(0.90_0_0)] truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-[oklch(0.48_0_0)] truncate mt-0.5 font-normal">
                {user.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[oklch(1_0_0_/0.07)] my-1" />
          </>
        )}

        <DropdownMenuItem
          onClick={handleProfile}
          className={cn(
            'flex items-center gap-2 rounded-lg px-2.5 py-1.5 cursor-pointer outline-none',
            'text-[11px] font-medium text-[oklch(0.65_0_0)]',
            'hover:bg-[oklch(1_0_0_/0.07)] hover:text-[oklch(0.88_0_0)]',
          )}
        >
          <User size={12} strokeWidth={1.8} />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleAccountSettings}
          className={cn(
            'flex items-center gap-2 rounded-lg px-2.5 py-1.5 cursor-pointer outline-none',
            'text-[11px] font-medium text-[oklch(0.65_0_0)]',
            'hover:bg-[oklch(1_0_0_/0.07)] hover:text-[oklch(0.88_0_0)]',
          )}
        >
          <Settings size={12} strokeWidth={1.8} />
          Account Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-[oklch(1_0_0_/0.07)] my-1" />

        <DropdownMenuItem
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-2 rounded-lg px-2.5 py-1.5 cursor-pointer outline-none',
            'text-[11px] font-medium text-[oklch(0.62_0.18_22)]',
            'hover:bg-[oklch(0.62_0.18_22_/0.10)] hover:text-[oklch(0.72_0.18_22)]',
          )}
        >
          <LogOut size={12} strokeWidth={1.8} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

// ─── AdminSidebar ────────────────────────────────────────────────────────────

export const AdminSidebar = memo(function AdminSidebar() {
  return (
    <motion.aside
      role="navigation"
      aria-label="Admin navigation"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen w-16 flex-col justify-between',
        'py-5 gap-0',
        'bg-[oklch(0.12_0.005_264_/0.92)] backdrop-blur-2xl',
        // Border
        'border-r border-[oklch(1_0_0_/0.06)]',
        // Shadow — subtle inner edge glow + outer depth
        'shadow-[1px_0_0_oklch(1_0_0_/0.04),4px_0_40px_oklch(0_0_0_/0.45)]',
      )}
    >
      {/* ── Top: Brand Logo ─────────────────────────────── */}
      <div className="flex items-center justify-center pb-5">
        <SidebarLogo />
      </div>

      {/* ── Center: Navigation Items ─────────────────────── */}
      <nav
        role="list"
        aria-label="Main admin navigation"
        className="flex flex-col items-center gap-2.5 py-4 w-full px-4 scrollbar-none bg-secondary/25 rounded-3xl"
      >
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.to} item={item} />
        ))}
      </nav>

      {/* ── Bottom: Settings + Profile ───────────────────── */}
      <div className="flex flex-col items-center gap-1 px-4 py-4 bg-secondary/25 rounded-3xl">
        <SidebarSettings />
        <SidebarProfile />
      </div>
    </motion.aside>
  );
});

export default AdminSidebar;
