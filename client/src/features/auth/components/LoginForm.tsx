import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router';
import * as React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { loginFormSchema, type LoginFormValues } from '../schema/auth.form.schema';
import { useAuth } from '../hook/useAuth';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearError } from '../state/auth.slice';
import { FormField } from './shared/FormField';
import { PasswordInput } from './shared/PasswordInput';
import { AuthErrorBanner } from './AuthErrorBanner';
import { Button } from '@components/ui/button';
import { cn } from '@/lib/utils';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogin } = useAuth();
  const { loading, error, isAuthenticated } = useAppSelector((s) => s.auth);

  // Auto-close modal when login succeeds
  React.useEffect(() => {
    if (!isAuthenticated) return;
    const background = (location.state as { background?: Location } | null)?.background;
    const timer = setTimeout(() => {
      navigate(background ?? '/', { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, location.state]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    dispatch(clearError());
    await handleLogin(values);
  }

  const linkClass = cn(
    'text-white/80 underline underline-offset-4',
    'decoration-white/30 hover:decoration-white hover:text-white',
    'transition-colors duration-300 text-[13px] font-light',
  );

  return (
    <form
      id="login-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      noValidate
    >
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-[24px] font-light tracking-[-0.02em] text-white leading-[1.2]">
          Welcome back
        </h2>
        <p className="text-[13px] text-white/50 leading-relaxed font-light">
          Sign in to your Snitch account
        </p>
      </div>

      <AuthErrorBanner message={error} type="error" onDismiss={() => dispatch(clearError())} />

      <div className="flex flex-col gap-5 mt-2">
        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <div className="flex justify-end -mt-3">
        <Link to="/forgot-password" className={linkClass} tabIndex={0}>
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className={cn(
          'w-full h-12 mt-2 text-[13px] font-semibold tracking-widest uppercase rounded-full gap-2',
          'bg-white text-[#08060d]',
          'hover:bg-white/90 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)]',
          'transition-all duration-500 ease-out active:scale-[0.98]',
          'disabled:opacity-50 disabled:pointer-events-none disabled:scale-100 disabled:shadow-none',
        )}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <ArrowRight size={16} />
          </>
        )}
      </Button>

      <p className="text-[13px] text-white/50 text-center mt-2 font-light">
        New to Snitch?{' '}
        <Link to="/register" className={cn(linkClass, 'font-medium text-white')}>
          Create an account
        </Link>
      </p>
    </form>
  );
}
