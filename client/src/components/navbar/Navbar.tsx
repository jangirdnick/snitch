import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ShoppingBag, Heart, Search, Menu, X, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/features/auth/hook/useAuth';
import { Button } from '@components/ui/button';

const NAV_LINKS = [
  { label: 'New In', href: '/new-in' },
  { label: 'Men', href: '/men' },
  { label: 'Women', href: '/women' },
  { label: 'Accessories', href: '/accessories' },
  { label: 'Sale', href: '/sale' },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { handleLogout } = useAuth();

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  function openAuthModal(mode: 'login' | 'register') {
    navigate(`/${mode}`, { state: { background: location } });
  }

  return (
    <>
      <header className={cn('navbar', scrolled && 'navbar--scrolled')} role="banner">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo" aria-label="Snitch home">
            SNITCH
          </Link>

          {/* Desktop nav */}
          <nav className="navbar-links" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'navbar-link',
                  location.pathname === link.href && 'navbar-link--active',
                  link.label === 'Sale' && 'navbar-link--sale',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="navbar-actions">
            {/* Icon buttons */}
            <button className="navbar-icon-btn" aria-label="Search" type="button">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button className="navbar-icon-btn" aria-label="Wishlist" type="button">
              <Heart size={20} strokeWidth={1.5} />
            </button>
            <button className="navbar-icon-btn" aria-label="Cart" type="button">
              <ShoppingBag size={20} strokeWidth={1.5} />
            </button>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="navbar-user">
                <button
                  className="navbar-icon-btn navbar-user-btn"
                  aria-label={`Signed in as ${user?.firstName}`}
                  type="button"
                  title={user?.firstName}
                >
                  <User size={20} strokeWidth={1.5} />
                </button>
                <button
                  className="navbar-icon-btn"
                  aria-label="Sign out"
                  type="button"
                  onClick={handleLogout}
                  title="Sign out"
                >
                  <LogOut size={20} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <div className="navbar-auth-btns">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuthModal('login')}
                  id="navbar-login-btn"
                  className="navbar-login-btn"
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  onClick={() => openAuthModal('register')}
                  id="navbar-register-btn"
                  className="navbar-signup-btn"
                >
                  Sign up
                </Button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="navbar-hamburger"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X size={22} strokeWidth={1.5} />
              ) : (
                <Menu size={22} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn('navbar-mobile-menu', mobileOpen && 'navbar-mobile-menu--open')}
        aria-hidden={!mobileOpen}
        id="mobile-menu"
      >
        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'navbar-mobile-link',
                link.label === 'Sale' && 'navbar-mobile-link--sale',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {!isAuthenticated && (
          <div className="navbar-mobile-auth">
            <Button variant="outline" onClick={() => openAuthModal('login')} className="w-full">
              Sign in
            </Button>
            <Button onClick={() => openAuthModal('register')} className="w-full">
              Create account
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
