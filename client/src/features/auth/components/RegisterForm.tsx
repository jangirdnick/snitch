import * as React from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { store } from '@/store/store';
import { clearError, clearMessage } from '../state/auth.slice';
import { type RegisterStep1Values } from '../schema/auth.form.schema';
import { StepDetails } from './steps/StepDetails';
import { StepOTP } from './steps/StepOTP';
import { StepIndicator } from './shared/StepIndicator';
import { AuthErrorBanner } from './AuthErrorBanner';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

type Step = 'details' | 'otp';

export function RegisterForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { handleRegister, handleVerifyEmail } = useAuth();
  const { loading, error, message } = useAppSelector((s) => s.auth);

  const [step, setStep] = React.useState<Step>('details');
  const [stepData, setStepData] = React.useState<RegisterStep1Values | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [direction, setDirection] = React.useState<'forward' | 'back'>('forward');

  // Auto-close on register success — register doesn't set isAuthenticated,
  // so watch for the success message from the server
  React.useEffect(() => {
    if (!message) return;
    setSuccess(true);
    const timer = setTimeout(() => navigate('/login', { replace: true }), 2000);
    return () => clearTimeout(timer);
  }, [message, navigate]);

  async function handleStep1Next(values: RegisterStep1Values) {
    dispatch(clearError());
    await handleVerifyEmail(values.email);
    // Only advance to OTP step if no error was set by handleVerifyEmail
    const currentError = store.getState().auth.error;
    if (currentError) return; // stay on step 1 — error banner will show
    setStepData(values);
    setDirection('forward');
    setStep('otp');
  }

  async function handleOTPVerify(otp: string) {
    if (!stepData) return;
    dispatch(clearError());

    const payload = {
      firstName: stepData.firstName,
      ...(stepData.lastName ? { lastName: stepData.lastName } : {}),
      email: stepData.email,
      password: stepData.password,
      contact: {
        countryCode: stepData.contact.countryCode,
        phoneNumber: stepData.contact.phoneNumber,
      },
      otp,
    };

    await handleRegister(payload);
  }

  function handleBack() {
    dispatch(clearError());
    dispatch(clearMessage());
    setDirection('back');
    setStep('details');
  }

  async function handleResend() {
    if (!stepData) return;
    dispatch(clearError());
    await handleVerifyEmail(stepData.email);
  }

  const stepIndex = step === 'details' ? 0 : 1;

  const variants: Variants = {
    initial: (dir: 'forward' | 'back') => ({
      x: dir === 'forward' ? 32 : -32,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.05, 0.7, 0.1, 1] },
    },
    exit: (dir: 'forward' | 'back') => ({
      x: dir === 'forward' ? -32 : 32,
      opacity: 0,
      transition: { duration: 0.3, ease: [0.3, 0, 1, 1] },
    }),
  };

  return (
    <div className="flex flex-col">
      <StepIndicator totalSteps={2} currentStep={stepIndex} />

      {error && step === 'otp' && (
        <AuthErrorBanner message={error} type="error" onDismiss={() => dispatch(clearError())} />
      )}

      <div className="relative overflow-hidden w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            {step === 'details' && (
              <StepDetails
                defaultValues={stepData ?? undefined}
                onNext={handleStep1Next}
                loading={loading}
              />
            )}
            {step === 'otp' && (
              <StepOTP
                email={stepData?.email ?? ''}
                onVerify={handleOTPVerify}
                onBack={handleBack}
                onResend={handleResend}
                loading={loading}
                success={success}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {step === 'details' && (
        <p className="mt-6 text-[13px] text-white/50 text-center font-light">
          Already have an account?{' '}
          <Link
            to="/login"
            className={cn(
              'font-medium text-white underline underline-offset-4',
              'decoration-white/30 hover:decoration-white hover:text-white',
              'transition-colors duration-300',
            )}
          >
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
