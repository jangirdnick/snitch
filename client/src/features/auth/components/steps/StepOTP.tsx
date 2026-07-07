import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle2, Loader2, RotateCcw } from 'lucide-react';
import { registerStep2Schema, type RegisterStep2Values } from '../../schema/auth.form.schema';
import { OTPInput } from '../shared/OTPInput';
import { Button } from '@components/ui/button';

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
      <div className="auth-form auth-form--success">
        <div className="auth-success-icon">
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </div>
        <h2 className="auth-form-title">Account created!</h2>
        <p className="auth-form-subtitle">Welcome to Snitch. Redirecting you now…</p>
      </div>
    );
  }

  return (
    <form id="register-step-otp" onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
      <button
        type="button"
        onClick={onBack}
        className="auth-back-btn"
        aria-label="Go back to details"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="auth-form-header">
        <h2 className="auth-form-title">Check your email</h2>
        <p className="auth-form-subtitle">
          We sent a 6-digit code to <strong className="auth-email-highlight">{email}</strong>
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

      <Button type="submit" disabled={loading} className="auth-submit-btn">
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Verifying…
          </>
        ) : (
          <>
            <CheckCircle2 size={16} />
            Verify & Create Account
          </>
        )}
      </Button>

      <div className="auth-resend">
        {canResend ? (
          <button type="button" onClick={handleResend} className="auth-resend-btn">
            <RotateCcw size={14} />
            Resend code
          </button>
        ) : (
          <p className="auth-resend-countdown">
            Resend in <span className="auth-resend-timer">{countdown}s</span>
          </p>
        )}
      </div>
    </form>
  );
}
