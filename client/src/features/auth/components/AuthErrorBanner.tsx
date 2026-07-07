import * as React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthErrorBannerProps {
  message: string | null;
  type?: 'error' | 'success';
  onDismiss?: () => void;
}

export function AuthErrorBanner({ message, type = 'error', onDismiss }: AuthErrorBannerProps) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (message) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [message]);

  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'auth-banner',
        type === 'error' && 'auth-banner--error',
        type === 'success' && 'auth-banner--success',
        visible && 'auth-banner--visible',
      )}
    >
      <span className="auth-banner-icon">
        {type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
      </span>
      <span className="auth-banner-text">{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="auth-banner-dismiss"
          aria-label="Dismiss message"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
