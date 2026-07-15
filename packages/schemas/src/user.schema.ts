import { z } from 'zod';

const nameField = (label: string) =>
  z
    .string({ required_error: `${label} is required` })
    .trim()
    .min(3, `${label} must be at least 3 characters`)
    .max(50, `${label} must be less than 50 characters`);

const passwordField = z
  .string({ required_error: 'Password is required' })
  .min(6, 'Password must be at least 6 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    'Password must contain uppercase, lowercase, number and special character',
  );

const emailField = z
  .string({ required_error: 'Email is required' })
  .trim()
  .toLowerCase()
  .email('Please enter a valid email address');

const contactSchema = z.object({
  countryCode: z
    .string({ required_error: 'Country code is required' })
    .trim()
    .regex(/^\+\d{1,4}$/, 'Please enter a valid country code (e.g. +91)'),

  phoneNumber: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .regex(/^\d{10,15}$/, 'Phone number must be 10-15 digits'),
});

export const createUserSchema = z.object({
  firstName: nameField('First name'),
  lastName: z.string().trim().max(50).optional(),
  email: emailField,
  otp: z
    .string({ required_error: 'OTP is required' })
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
  contact: contactSchema,
  password: passwordField,
  // confirmPassword: z.string({ required_error: 'Confirm password is required' }),
});

export const loginUserSchema = z.object({
  email: emailField,
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

export const emailVerified = z.object({
  email: emailField,
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type LoginUserDto = z.infer<typeof loginUserSchema>;
export type EmailVerifiedDto = z.infer<typeof emailVerified>;
