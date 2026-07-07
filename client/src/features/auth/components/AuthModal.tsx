import * as React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

type AuthMode = 'login' | 'register';

interface AuthModalProps {
  mode: AuthMode;
}

export function AuthModal({ mode }: AuthModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [closing, setClosing] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  // Trigger enter animation on mount
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Close on Escape key
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll while modal is open
  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Focus trap — focus first interactive element in modal
  const panelRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (mounted && panelRef.current) {
      const first = panelRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    }
  }, [mounted]);

  function handleClose() {
    setClosing(true);
    setTimeout(() => {
      // Navigate back — preserve previous location or go home
      const background = (location.state as { background?: Location } | null)?.background;
      navigate(background ?? '/', { replace: true });
    }, 250);
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) handleClose();
  }

  return (
    <div
      ref={overlayRef}
      className={cn(
        'auth-modal-overlay',
        mounted && !closing && 'auth-modal-overlay--visible',
        closing && 'auth-modal-overlay--closing',
      )}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'login' ? 'Sign in' : 'Create account'}
      onClick={handleOverlayClick}
    >
      <div
        ref={panelRef}
        className={cn(
          'auth-modal-panel',
          mounted && !closing && 'auth-modal-panel--visible',
          closing && 'auth-modal-panel--closing',
        )}
      >
        {/* Modal header */}
        <div className="auth-modal-topbar">
          <span className="auth-modal-brand">SNITCH</span>
          <button
            type="button"
            onClick={handleClose}
            className="auth-modal-close"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="auth-modal-body">{mode === 'login' ? <LoginForm /> : <RegisterForm />}</div>
      </div>
    </div>
  );
}
