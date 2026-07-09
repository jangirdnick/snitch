import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2 } from 'lucide-react';
import { registerStep1Schema, type RegisterStep1Values } from '../../schema/auth.form.schema';
import { FormField } from '../shared/FormField';
import { PasswordInput } from '../shared/PasswordInput';
import { Button } from '@components/ui/button';
import { cn } from '@/lib/utils';

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
      className="flex flex-col gap-6"
      noValidate
    >
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-[24px] font-light tracking-[-0.02em] text-white leading-[1.2]">
          Create your account
        </h2>
        <p className="text-[13px] text-white/50 leading-relaxed font-light">
          Join Snitch for exclusive access
        </p>
      </div>

      <div className="flex flex-col gap-5 mt-2">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
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
        <div className="grid grid-cols-[96px_1fr] gap-4">
          <FormField
            label="Code"
            placeholder="+91"
            autoComplete="tel-country-code"
            required
            error={errors.contact?.countryCode?.message}
            {...register('contact.countryCode')}
          />
          <FormField
            label="Phone Number"
            type="tel"
            placeholder="9876543210"
            autoComplete="tel-national"
            required
            error={errors.contact?.phoneNumber?.message}
            {...register('contact.phoneNumber')}
          />
        </div>

        <PasswordInput
          label="Password"
          placeholder="Min. 6 chars"
          autoComplete="new-password"
          required
          error={errors.password?.message}
          hint="Must include uppercase, lowercase, number & special character"
          {...register('password')}
        />
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
