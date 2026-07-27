import { z, type LoginUserDto, type createUserSchema, loginUserSchema } from '@snitch/schemas';

// ─── Login ───────────────────────────────────────────────────────────────────
// Direct re-export — no duplication
export const loginFormSchema = loginUserSchema;
export type LoginFormValues = LoginUserDto;

// ─── Register Step 1: Personal Details ───────────────────────────────────────
// Subset of createUserSchema — first name, last name, email, phone, password
export const registerStep1Schema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .min(3, 'First name must be at least 3 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z.string().trim().max(50).optional(),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  contact: z.object({
    countryCode: z
      .string({ required_error: 'Country code is required' })
      .trim()
      .regex(/^\+\d{1,4}$/, 'Country code must be like +91'),
    phoneNumber: z
      .string({ required_error: 'Phone number is required' })
      .trim()
      .regex(/^\d{10,15}$/, 'Phone number must be 10–15 digits'),
  }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Must contain uppercase, lowercase, number & special character',
    ),
});
export type RegisterStep1Values = z.infer<typeof registerStep1Schema>;

// ─── Register Step 2: OTP Verification ───────────────────────────────────────
export const registerStep2Schema = z.object({
  otp: z
    .string({ required_error: 'OTP is required' })
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});
export type RegisterStep2Values = z.infer<typeof registerStep2Schema>;

// ─── Full Register — used when building FormData for API ─────────────────────
// Re-export the full schema type so nothing is duplicated
export type CreateUserFormValues = z.infer<typeof createUserSchema>;
