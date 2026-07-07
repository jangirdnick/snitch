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

  return (
    <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
      <div className="auth-form-header">
        <h2 className="auth-form-title">Welcome back</h2>
        <p className="auth-form-subtitle">Sign in to your Snitch account</p>
      </div>

      <AuthErrorBanner message={error} type="error" onDismiss={() => dispatch(clearError())} />

      <div className="auth-form-fields">
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

      <div className="auth-form-forgot">
        <Link to="/forgot-password" className="auth-link" tabIndex={0}>
          Forgot password?
        </Link>
      </div>

      <Button type="submit" disabled={loading} className="auth-submit-btn">
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

      <p className="auth-form-switch">
        New to Snitch?{' '}
        <Link to="/register" className="auth-link auth-link--bold">
          Create an account
        </Link>
      </p>
    </form>
  );
}
