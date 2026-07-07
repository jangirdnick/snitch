import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2 } from 'lucide-react';
import { registerStep1Schema, type RegisterStep1Values } from '../../schema/auth.form.schema';
import { FormField } from '../shared/FormField';
import { PasswordInput } from '../shared/PasswordInput';
import { Button } from '@components/ui/button';

interface StepDetailsProps {
  defaultValues?: Partial<RegisterStep1Values>;
  onNext: (values: RegisterStep1Values) => void;
  loading?: boolean;
}

export function StepDetails({ defaultValues, onNext, loading = false }: StepDetailsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterStep1Values>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues,
  });

  return (
    <form
      id="register-step-details"
      onSubmit={handleSubmit(onNext)}
      className="auth-form"
      noValidate
    >
      <div className="auth-form-header">
        <h2 className="auth-form-title">Create your account</h2>
        <p className="auth-form-subtitle">Join Snitch for exclusive access</p>
      </div>

      <div className="auth-form-fields">
        {/* Name row */}
        <div className="auth-form-row">
          <FormField
            label="First Name"
            placeholder="Alex"
            autoComplete="given-name"
            required
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <FormField
            label="Last Name"
            placeholder="Kim"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Phone row */}
        <div className="auth-form-row auth-form-row--phone">
          <FormField
            label="Code"
            placeholder="+91"
            autoComplete="tel-country-code"
            required
            error={errors.contact?.countryCode?.message}
            className="auth-phone-code"
            {...register('contact.countryCode')}
          />
          <FormField
            label="Phone Number"
            type="tel"
            placeholder="9876543210"
            autoComplete="tel-national"
            required
            error={errors.contact?.phoneNumber?.message}
            className="auth-phone-number"
            {...register('contact.phoneNumber')}
          />
        </div>

        <PasswordInput
          label="Password"
          placeholder="Min. 6 chars — include A, a, 1, @"
          autoComplete="new-password"
          required
          error={errors.password?.message}
          hint="Must include uppercase, lowercase, number & special character"
          {...register('password')}
        />
      </div>

      <Button type="submit" disabled={loading} className="auth-submit-btn">
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Sending OTP…
          </>
        ) : (
          <>
            Continue
            <ArrowRight size={16} />
          </>
        )}
      </Button>
    </form>
  );
}
