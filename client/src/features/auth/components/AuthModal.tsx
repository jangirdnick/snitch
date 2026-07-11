import * as React from 'react';
import { useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

type AuthMode = 'login' | 'register';

interface AuthModalProps {
  mode: AuthMode;
}

export function AuthModal({ mode }: AuthModalProps) {
  const navigate = useNavigate();
  const overlayRef = React.useRef<HTMLDivElement>(null);

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

  function handleClose() {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) handleClose();
  }

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'fixed inset-0 z-200',
        'flex items-end sm:items-center justify-center',
        'bg-[#08060d]/10 backdrop-blur-md',
      )}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'login' ? 'Sign in' : 'Create account'}
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          'w-2/5 max-h-[90svh] sm:max-h-fit overflow-y-auto',
          'bg-[#08060d]/85 backdrop-blur-[5px]',
          'rounded-t-[28px] sm:rounded-[32px]',
          'border-t sm:border border-white/8',
          'shadow-[0_-24px_80px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.03)]',
          'sm:shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)]',
          'text-white',
        )}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-white/6">
          <span className="text-[11px] font-medium tracking-[0.32em] text-white/40 uppercase">
            SNITCH
          </span>
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full',
              'text-white/40 hover:text-white hover:bg-white/10',
              'transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
            )}
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Form content */}
        <div className="px-8 pt-8 pb-10">{mode === 'login' ? <LoginForm /> : <RegisterForm />}</div>
      </motion.div>
    </motion.div>
  );
}
