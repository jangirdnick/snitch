import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle2, Loader2, RotateCcw } from 'lucide-react';
import { registerStep2Schema, type RegisterStep2Values } from '../../schema/auth.form.schema';
import { OTPInput } from '../shared/OTPInput';
import { Button } from '@components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface StepOTPProps {
  email: string;
  onVerify: (otp: string) => void;
  onBack: () => void;
  onResend: () => void;
  loading?: boolean;
  success?: boolean;
}

const RESEND_SECONDS = 60;

export function StepOTP({
  email,
  onVerify,
  onBack,
  onResend,
  loading = false,
  success = false,
}: StepOTPProps) {
  const [countdown, setCountdown] = React.useState(RESEND_SECONDS);
  const [canResend, setCanResend] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setCountdown(RESEND_SECONDS);
    setCanResend(false);
    const tick = () => {
      setCountdown((c) => {
        if (c <= 1) {
          setCanResend(true);
          return 0;
        }
        timerRef.current = setTimeout(tick, 1000);
        return c - 1;
      });
    };
    timerRef.current = setTimeout(tick, 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleResend() {
    if (!canResend) return;
    onResend();
    setCountdown(RESEND_SECONDS);
    setCanResend(false);
    const tick = () => {
      setCountdown((c) => {
        if (c <= 1) {
          setCanResend(true);
          return 0;
        }
        timerRef.current = setTimeout(tick, 1000);
        return c - 1;
      });
    };
    timerRef.current = setTimeout(tick, 1000);
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterStep2Values>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: { otp: '' },
  });

  function onSubmit(values: RegisterStep2Values) {
    onVerify(values.otp);
  }

  if (success) {
    return (
      <div className="flex flex-col gap-6 items-center text-center py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          className="text-white mb-2"
        >
          <CheckCircle2 size={48} strokeWidth={1} />
        </motion.div>
        <div className="flex flex-col gap-2">
          <h2 className="text-[24px] font-light tracking-[-0.02em] text-white leading-[1.2]">
            Account created
          </h2>
          <p className="text-[13px] text-white/50 leading-relaxed font-light">
            Welcome to Snitch. Redirecting you now…
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      id="register-step-otp"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 relative"
      noValidate
    >
      <div className="absolute -top-1 left-0">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center w-8 h-8 text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          aria-label="Go back to details"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex flex-col gap-1 text-center mt-2">
        <h2 className="text-[24px] font-light tracking-[-0.02em] text-white leading-[1.2]">
          Check your email
        </h2>
        <p className="text-[13px] text-white/50 leading-relaxed font-light">
          We sent a 6-digit code to <strong className="text-white font-medium">{email}</strong>
        </p>
      </div>

      <Controller
        name="otp"
        control={control}
        render={({ field }) => (
          <OTPInput
            value={field.value}
            onChange={field.onChange}
            error={errors.otp?.message}
            disabled={loading}
          />
        )}
      />

      <Button
        type="submit"
        disabled={loading}
        className={cn(
          'w-full h-12 mt-4 text-[13px] font-semibold tracking-widest uppercase rounded-full gap-2',
          'bg-white text-[#08060d]',
          'hover:bg-white/90 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)]',
          'transition-all duration-500 ease-out active:scale-[0.98]',
          'disabled:opacity-50 disabled:pointer-events-none disabled:scale-100 disabled:shadow-none',
        )}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Verifying…
          </>
        ) : (
          <>Verify & Create Account</>
        )}
      </Button>

      <div className="text-center mt-2">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="inline-flex items-center gap-1.5 text-[13px] font-light text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-sm"
          >
            <RotateCcw size={14} />
            Resend code
          </button>
        ) : (
          <p className="text-[13px] text-white/50 font-light">
            Resend in <span className="font-medium text-white tabular-nums">{countdown}s</span>
          </p>
        )}
      </div>
    </form>
  );
}
