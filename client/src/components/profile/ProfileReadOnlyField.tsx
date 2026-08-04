import React, { memo, useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showToast } from '@/lib/toast';

interface ProfileReadOnlyFieldProps {
  label: string;
  value: string;
  icon?: React.ElementType;
  isMonospace?: boolean;
  copyable?: boolean;
  className?: string;
}

export const ProfileReadOnlyField = memo(function ProfileReadOnlyField({
  label,
  value,
  icon: Icon,
  isMonospace = false,
  copyable = false,
  className,
}: ProfileReadOnlyFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(
      () => {
        setCopied(true);
        showToast.success(`Copied ${label}`);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {
        showToast.error('Failed to copy');
      },
    );
  }, [value, label]);

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 py-3 border-b border-white/10 last:border-0 text-xs sm:text-[13px]',
        className,
      )}
    >
      {/* Left side: Icon + Label */}
      <div className="flex items-center gap-2.5 min-w-0 text-white/60 font-medium">
        {Icon && <Icon size={14} strokeWidth={1.7} className="text-white/45 flex-shrink-0" />}
        <span className="truncate">{label}</span>
      </div>

      {/* Right side: Value + Action */}
      <div className="flex items-center gap-2 flex-shrink-0 text-right">
        <span
          className={cn(
            'text-white/95 font-medium',
            isMonospace && 'font-mono text-xs text-orange-300/90 tracking-wide',
            !value && 'text-white/35 italic',
          )}
        >
          {value || '—'}
        </span>

        {copyable && value && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-orange-500"
            title={`Copy ${label}`}
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
        )}
      </div>
    </div>
  );
});

export default ProfileReadOnlyField;
